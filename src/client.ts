/**
 * NZBGet JSON-RPC Client
 * Handles communication with NZBGet API
 */

import type {
  NZBGetStatus,
  NZBGroup,
  NZBHistory,
  LogEntry,
  NZBFile,
  ServerVolume,
  NZBConfig,
  EditQueueCommand,
  PPParameter,
} from './types.js';

export interface NZBGetConfig {
  host: string;
  port: number;
  username?: string;
  password?: string;
  useHttps?: boolean;
}

export class NZBGetClient {
  private clientConfig: NZBGetConfig;
  private baseUrl: string;

  constructor(config: NZBGetConfig) {
    this.clientConfig = {
      ...config,
      host: config.host || 'localhost',
      port: config.port || 6789,
    };
    const protocol = this.clientConfig.useHttps ? 'https' : 'http';
    this.baseUrl = `${protocol}://${this.clientConfig.host}:${this.clientConfig.port}`;
  }

  /**
   * Make a JSON-RPC request to NZBGet
   */
  private async rpcCall<T>(method: string, params: unknown[] = []): Promise<T> {
    const url = `${this.baseUrl}/jsonrpc`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Add authentication if provided
    if (this.clientConfig.username && this.clientConfig.password) {
      const auth = Buffer.from(`${this.clientConfig.username}:${this.clientConfig.password}`).toString('base64');
      headers['Authorization'] = `Basic ${auth}`;
    }

    const body = JSON.stringify({
      jsonrpc: '2.0',
      method,
      params,
      id: 1,
    });

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body,
    });

    if (!response.ok) {
      throw new Error(`NZBGet RPC error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json() as { error?: { message?: string }; result: unknown };

    if (data.error) {
      throw new Error(`NZBGet RPC error: ${data.error.message || JSON.stringify(data.error)}`);
    }

    return data.result as T;
  }

  /**
   * Get current server status
   */
  async status(): Promise<NZBGetStatus> {
    return this.rpcCall<NZBGetStatus>('status');
  }

  /**
   * List download queue groups
   */
  async listGroups(numberOfLogEntries = 0): Promise<NZBGroup[]> {
    return this.rpcCall<NZBGroup[]>('listgroups', [numberOfLogEntries]);
  }

  /**
   * List files in a group
   */
  async listFiles(nzbId: number): Promise<NZBFile[]> {
    return this.rpcCall<NZBFile[]>('listfiles', [nzbId]);
  }

  /**
   * Get history
   */
  async history(hidden = false): Promise<NZBHistory[]> {
    return this.rpcCall<NZBHistory[]>('history', [hidden]);
  }

  /**
   * Add NZB to queue
   */
  async append(
    nzbFilename: string,
    nzbContent: string,
    category = '',
    priority = 0,
    addToTop = false,
    addPaused = false,
    dupeKey = '',
    dupeScore = 0,
    dupeMode = 'SCORE',
    ppParameters: PPParameter[] = []
  ): Promise<number> {
    return this.rpcCall<number>('append', [
      nzbFilename,
      nzbContent,
      category,
      priority,
      addToTop,
      addPaused,
      dupeKey,
      dupeScore,
      dupeMode,
      ppParameters,
    ]);
  }

  /**
   * Edit queue
   */
  async editQueue(
    command: EditQueueCommand,
    param: string | number,
    ids: number[]
  ): Promise<boolean> {
    // Handle offset parameter (v18.0+)
    if (typeof param === 'number') {
      return this.rpcCall<boolean>('editqueue', [command, param, '', ids]);
    }
    return this.rpcCall<boolean>('editqueue', [command, 0, param, ids]);
  }

  /**
   * Pause download queue
   */
  async pauseDownload(): Promise<boolean> {
    return this.rpcCall<boolean>('pausedownload');
  }

  /**
   * Resume download queue
   */
  async resumeDownload(): Promise<boolean> {
    return this.rpcCall<boolean>('resumedownload');
  }

  /**
   * Pause post-processing
   */
  async pausePost(): Promise<boolean> {
    return this.rpcCall<boolean>('pausepost');
  }

  /**
   * Resume post-processing
   */
  async resumePost(): Promise<boolean> {
    return this.rpcCall<boolean>('resumepost');
  }

  /**
   * Pause scan
   */
  async pauseScan(): Promise<boolean> {
    return this.rpcCall<boolean>('pausescan');
  }

  /**
   * Resume scan
   */
  async resumeScan(): Promise<boolean> {
    return this.rpcCall<boolean>('resumescan');
  }

  /**
   * Set download rate limit
   */
  async rate(limit: number): Promise<boolean> {
    return this.rpcCall<boolean>('rate', [limit]);
  }

  /**
   * Get log entries
   */
  async log(idFrom = 0, numberOfEntries = 0): Promise<LogEntry[]> {
    return this.rpcCall<LogEntry[]>('log', [idFrom, numberOfEntries]);
  }

  /**
   * Get server volumes
   */
  async serverVolumes(): Promise<ServerVolume[]> {
    return this.rpcCall<ServerVolume[]>('servervolumes');
  }

  /**
   * Reset server volume
   */
  async resetServerVolume(serverId: number, counter = ''): Promise<boolean> {
    return this.rpcCall<boolean>('resetservervolume', [serverId, counter]);
  }

  /**
   * Get NZBGet version
   */
  async version(): Promise<string> {
    return this.rpcCall<string>('version');
  }

  /**
   * Shutdown NZBGet
   */
  async shutdown(): Promise<boolean> {
    return this.rpcCall<boolean>('shutdown');
  }

  /**
   * Reload NZBGet
   */
  async reload(): Promise<boolean> {
    return this.rpcCall<boolean>('reload');
  }

  /**
   * Get config
   */
  async getConfig(): Promise<NZBConfig> {
    return this.rpcCall<NZBConfig>('config');
  }

  /**
   * Load config
   */
  async loadConfig(): Promise<NZBConfig> {
    return this.rpcCall<NZBConfig>('loadconfig');
  }

  /**
   * Save config
   */
  async saveConfig(config: NZBConfig): Promise<boolean> {
    return this.rpcCall<boolean>('saveconfig', [config]);
  }

  /**
   * Schedule resume
   */
  async scheduleResume(time: number): Promise<boolean> {
    return this.rpcCall<boolean>('scheduleresume', [time]);
  }

  /**
   * Scan for new NZB files
   */
  async scan(): Promise<boolean> {
    return this.rpcCall<boolean>('scan');
  }

  /**
   * Write log message
   */
  async writeLog(kind: 'INFO' | 'WARNING' | 'ERROR' | 'DEBUG', text: string): Promise<boolean> {
    return this.rpcCall<boolean>('writelog', [kind, text]);
  }
}

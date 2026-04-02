/**
 * NZBGet API Types
 * Based on NZBGet API documentation (v13.0+)
 */

// Status response
export interface NZBGetStatus {
  RemainingSizeLo: number;
  RemainingSizeHi: number;
  RemainingSizeMB: number;
  ForcedSizeLo: number;
  ForcedSizeHi: number;
  ForcedSizeMB: number;
  DownloadedSizeLo: number;
  DownloadedSizeHi: number;
  DownloadedSizeMB: number;
  ArticleCacheLo: number;
  ArticleCacheHi: number;
  ArticleCacheMB: number;
  DownloadRate: number;
  AverageDownloadRate: number;
  DownloadLimit: number;
  ThreadCount: number;
  PostJobCount: number;
  ParJobCount: number;
  UrlCount: number;
  UpTimeSec: number;
  DownloadTimeSec: number;
  ServerStandBy: boolean;
  DownloadPaused: boolean;
  Download2Paused: boolean;
  ServerPaused: boolean;
  PostPaused: boolean;
  ScanPaused: boolean;
  ServerTime: number;
  ResumeTime: number;
  FeedActive: boolean;
  FreeDiskSpaceLo: number;
  FreeDiskSpaceHi: number;
  FreeDiskSpaceMB: number;
  NewsServers: NewsServer[];
}

export interface NewsServer {
  ID: number;
  Active: boolean;
}

// Group (download queue item)
export interface NZBGroup {
  NZBID: number;
  FirstID: number;
  LastID: number;
  NZBFilename: string;
  NZBName: string;
  NZBNicename: string;
  Kind: 'NZB' | 'URL';
  URL: string;
  DestDir: string;
  FinalDir: string;
  Category: string;
  FileSizeLo: number;
  FileSizeHi: number;
  FileSizeMB: number;
  RemainingSizeLo: number;
  RemainingSizeHi: number;
  RemainingSizeMB: number;
  PausedSizeLo: number;
  PausedSizeHi: number;
  PausedSizeMB: number;
  FileCount: number;
  RemainingFileCount: number;
  RemainingParCount: number;
  MinPostTime: number;
  MaxPostTime: number;
  MinPriority: number;
  MaxPriority: number;
  ActiveDownloads: number;
  Status: string;
  TotalArticles: number;
  SuccessArticles: number;
  FailedArticles: number;
  Health: number;
  CriticalHealth: number;
  DownloadedSizeLo: number;
  DownloadedSizeHi: number;
  DownloadedSizeMB: number;
  DownloadTimeSec: number;
  MessageCount: number;
  DupeKey: string;
  DupeScore: number;
  DupeMode: string;
  Parameters: PPParameter[];
  Deleted: boolean;
  ServerStats: ServerStat[];
  ParStatus: string;
  UnpackStatus: string;
  MoveStatus: string;
  ScriptStatus: string;
  DeleteStatus: string;
  MarkStatus: string;
  ScriptStatuses: ScriptStatus[];
  PostTotalTimeSec: number;
  ParTimeSec: number;
  RepairTimeSec: number;
  UnpackTimeSec: number;
  PostInfoText: string;
  PostStageProgress: number;
  PostStageTimeSec: number;
  Log: LogEntry[];
}

export interface PPParameter {
  Name: string;
  Value: string;
}

export interface ServerStat {
  ServerID: number;
  SuccessArticles: number;
  FailedArticles: number;
}

export interface ScriptStatus {
  Name: string;
  Status: string;
}

// History item
export interface NZBHistory {
  NZBID: number;
  ID: number;
  Kind: 'NZB' | 'URL' | 'DUP';
  NZBFilename: string;
  Name: string;
  NZBNicename: string;
  URL: string;
  HistoryTime: number;
  DestDir: string;
  FinalDir: string;
  Category: string;
  FileSizeLo: number;
  FileSizeHi: number;
  FileSizeMB: number;
  FileCount: number;
  RemainingFileCount: number;
  MinPostTime: number;
  MaxPostTime: number;
  TotalArticles: number;
  SuccessArticles: number;
  FailedArticles: number;
  Health: number;
  DownloadedSizeLo: number;
  DownloadedSizeHi: number;
  DownloadedSizeMB: number;
  DownloadTimeSec: number;
  PostTotalTimeSec: number;
  ParTimeSec: number;
  RepairTimeSec: number;
  UnpackTimeSec: number;
  MessageCount: number;
  DupeKey: string;
  DupeScore: number;
  DupeMode: string;
  Status: string;
  ParStatus: string;
  ExParStatus: string;
  UnpackStatus: string;
  UrlStatus: string;
  ScriptStatus: string;
  ScriptStatuses: ScriptStatus[];
  MoveStatus: string;
  DeleteStatus: string;
  MarkStatus: string;
  ExtraParBlocks: number;
  Parameters: PPParameter[];
  ServerStats: ServerStat[];
  Log: LogEntry[];
}

// Log entry
export interface LogEntry {
  ID: number;
  Kind: 'INFO' | 'WARNING' | 'ERROR' | 'DEBUG';
  Time: number;
  Text: string;
}

// File info
export interface NZBFile {
  ID: number;
  NZBID: number;
  Filename: string;
  FileSizeLo: number;
  FileSizeHi: number;
  FileSizeMB: number;
  RemainingSizeLo: number;
  RemainingSizeHi: number;
  RemainingSizeMB: number;
  Paused: boolean;
  ActiveDownloads: number;
}

// Server volume
export interface ServerVolume {
  ServerID: number;
  BytesLo: number;
  BytesHi: number;
  BytesMB: number;
}

// Config
export interface NZBConfig {
  [key: string]: string;
}

// Command types for editqueue
export type EditQueueCommand =
  | 'FileMoveOffset'
  | 'FileMoveTop'
  | 'FileMoveBottom'
  | 'FilePause'
  | 'FileResume'
  | 'FileDelete'
  | 'FilePauseAllPars'
  | 'FilePauseExtraPars'
  | 'FileReorder'
  | 'FileSplit'
  | 'GroupMoveOffset'
  | 'GroupMoveTop'
  | 'GroupMoveBottom'
  | 'GroupPause'
  | 'GroupResume'
  | 'GroupDelete'
  | 'GroupDupeDelete'
  | 'GroupFinalDelete'
  | 'GroupPauseAllPars'
  | 'GroupPauseExtraPars'
  | 'GroupSetPriority'
  | 'GroupSetCategory'
  | 'GroupApplyCategory'
  | 'GroupMerge'
  | 'GroupSetParameter'
  | 'GroupSetName'
  | 'GroupSetDupeKey'
  | 'GroupSetDupeScore'
  | 'GroupSetDupeMode'
  | 'GroupSort'
  | 'PostDelete'
  | 'HistoryDelete'
  | 'HistoryFinalDelete'
  | 'HistoryReturn'
  | 'HistoryProcess'
  | 'HistoryRedownload'
  | 'HistorySetName'
  | 'HistorySetCategory'
  | 'HistorySetParameter'
  | 'HistorySetDupeKey'
  | 'HistorySetDupeScore'
  | 'HistorySetDupeMode'
  | 'HistorySetDupeBackup'
  | 'HistoryMarkBad'
  | 'HistoryMarkGood'
  | 'HistoryMarkSuccess';

// MCP Tool Response Types
export interface ToolResponse {
  content: Array<{
    type: 'text';
    text: string;
  }>;
  isError?: boolean;
}

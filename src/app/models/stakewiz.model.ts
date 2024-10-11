export interface Validator {
  rank: number
  identity: string
  vote_identity: string
  total_apy: number
  last_vote: number
  root_slot: number
  credits: number
  epoch_credits: number
  activated_stake: number
  version: string
  delinquent: boolean
  skip_rate: number
  updated_at: string
  first_epoch_with_stake: number
  name: string
  keybase: string
  description: string
  website: string
  commission: number
  image: string
  ip_latitude: string
  ip_longitude: string
  ip_city: string
  ip_country: string
  ip_asn: string
  ip_org: string
  mod: boolean
  is_jito: boolean
  jito_commission_bps: number
  vote_success: number
  vote_success_score: number
  skip_rate_score: number
  info_score: number
  commission_score: number
  first_epoch_distance: number
  epoch_distance_score: number
  stake_weight: number
  above_halt_line: boolean
  stake_weight_score: number
  withdraw_authority_score: number
  asn: string
  asn_concentration: number
  asn_concentration_score: number
  uptime: number
  uptime_score: number
  wiz_score: number
  version_valid: boolean
  city_concentration: number
  city_concentration_score: number
  invalid_version_score: number
  superminority_penalty: number
  score_version: number
  no_voting_override: boolean
  epoch: number
  epoch_slot_height: number
  asncity_concentration: number
  asncity_concentration_score: number
  stake_ratio: number
  credit_ratio: number
  apy_estimate: number
}

export interface Cluster {
  avg_credit_ratio: number
  avg_activated_stake: number
  avg_commission: number
  avg_skip_rate: number
  avg_apy: number
}


export interface StakeWizEpochInfo {
  epoch: number,
  start_slot: number,
  start_time: Date,
  slot_height: number,
  duration_seconds: number,
  elapsed_seconds: number,
  remaining_seconds: number,
  epochs_per_year: number,
  timepassInPercentgae?: number,
  ETA?: string;
}
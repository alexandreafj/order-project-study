variable "tf_organization_name" {
  description = "TF organization name"
  type        = string
  sensitive   = true
}

variable "tf_workspace_name" {
  description = "TF workspace name"
  type        = string
  sensitive   = true
}

variable "gcp_project" {
  description = "gcp project name"
  type        = string
  sensitive   = true
}

variable "gcp_region" {
  description = "gcp region name."
  type        = string
  sensitive   = true
}

variable "gcp_member" {
  description = "gcp member key."
  type        = string
  sensitive   = true
}
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

variable "container_registry_docker_image" {
  description = "container name"
  type        = string
  sensitive   = true
}

variable "instance_unix_socket" {
  description = "socket instance for sql connection"
  type        = string
  sensitive   = true
}

variable "mysql_username" {
  description = "mysql username"
  type        = string
  sensitive   = true
}

variable "mysql_password" {
  description = "mysql passsword"
  type        = string
  sensitive   = true
}

variable "mysql_database" {
  description = "mysql database"
  type        = string
  sensitive   = true
}

variable "redis_namespace" {
  description = "redis namespace keys"
  type        = string
  sensitive   = true
}
variable "redis_host" {
  description = "redis host"
  type        = string
  sensitive   = true
}

variable "gcp_sql_database_name" {
  description = "gcp database instance name"
  type        = string
  sensitive   = true
}

variable "new_relic_license_key" {
  description = "new relic license key to send metrics"
  type        = string
  sensitive   = true
}

variable "new_relic_app_name" {
  description = "new relic app name to send metrics"
  type        = string
  sensitive   = true
}
terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "4.36.0"
    }
  }
  backend "remote" {
    organization = "alexandre"

    workspaces {
      name = "order-api"
    }
  }
}

provider "google" {
  project = var.gcp_project
  region  = var.gcp_region
}

resource "google_pubsub_topic" "pub_sub_instance" {
  name = "order-topic"
  labels = {
    topic = "order-topic"
  }
}

resource "google_pubsub_subscription" "subscription_instance" {
  name  = "order-subscription"
  topic = google_pubsub_topic.pub_sub_instance.name

  labels = {
    subscription = "order-subscription"
  }

  # 20 minutes
  message_retention_duration = "600s"
  retain_acked_messages      = false

  ack_deadline_seconds = 20

  expiration_policy {
    ttl = "300000.5s"
  }
  retry_policy {
    minimum_backoff = "10s"
    maximum_backoff = "20s"
  }

  enable_exactly_once_delivery = true
  enable_message_ordering      = false
  dead_letter_policy {
    dead_letter_topic     = google_pubsub_topic.dead_letter_pub_sub_instance.id
    max_delivery_attempts = 10
  }
}

resource "google_pubsub_topic" "dead_letter_pub_sub_instance" {
  name = "dead-letter-order-topic"
  labels = {
    topic = "order-topic-dead-letter"
  }
}

resource "google_pubsub_subscription" "dead_letter_subscription_instance" {
  name  = "dead-letter-example-subscription"
  topic = google_pubsub_topic.dead_letter_pub_sub_instance.name

  labels = {
    subscription = "dead-letter-order-subscription"
  }

  # 20 minutes
  message_retention_duration = "600s"
  retain_acked_messages      = false

  ack_deadline_seconds = 20

  expiration_policy {
    ttl = "300000.5s"
  } 
  retry_policy {
    minimum_backoff = "10s"
    maximum_backoff = "20s"
  }

  enable_message_ordering      = true
}

resource "google_project_service" "run_api" {
  service = "run.googleapis.com"
}

resource "google_cloud_run_service" "default" {
  provider = google
  name     = "order-api"
  location = var.gcp_region

  template {
    spec {
      containers {
        image = var.container_registry_docker_image
        env {
          name  = "INSTANCE_UNIX_SOCKET"
          value = var.gcp_instance_unix_socket
        }
        env {
          name  = "MYSQL_PORT"
          value = "3306"
        }
        env {
          name  = "MYSQL_USERNAME"
          value = var.mysql_username
        }
        env {
          name  = "MYSQL_PASSWORD"
          value = var.mysql_password
        }
        env {
          name  = "MYSQL_DATABASE"
          value = var.mysql_database
        }
        env {
          name  = "MYSQL_PORT"
          value = "3306"
        }
        env {
          name  = "REDIS_HOST"
          value = var.redis_host
        }
        env {
          name  = "REDIS_PORT"
          value = "6379"
        }
        env {
          name  = "REDIS_NAMESPACE"
          value = var.redis_namespace
        }
        env {
          name  = "NODE_ENV"
          value = "production"
        }
        env {
          name  = "NEW_RELIC_LICENSE_KEY"
          value = var.new_relic_license_key
        }
        env {
          name  = "NEW_RELIC_APP_NAME"
          value = var.new_relic_app_name
        }
        ports {
          name           = "http1"
          container_port = "8080"
          protocol       = "TCP"
        }
        resources {
          limits = {
            "cpu"    = "1000m"
            "memory" = "512Mi"
          }
          requests = {
            "cpu"    = "1000m"
            "memory" = "256Mi"
          }
        }
      }
      timeout_seconds = 30
    }

    metadata {
      annotations = {
        "autoscaling.knative.dev/maxScale"      = "4"
        "run.googleapis.com/cloudsql-instances" = var.gcp_sql_database_name
        "run.googleapis.com/client-name"        = "terraform"
      }
    }
  }

  metadata {
    annotations = {
      cloud-run                           = "order"
      "run.googleapis.com/ingress"        = "all"
      "run.googleapis.com/ingress-status" = "all"
    }
  }

  traffic {
    percent         = 100
    latest_revision = true
  }

  depends_on                 = [google_project_service.run_api]
  autogenerate_revision_name = true

}

data "google_iam_policy" "noauth" {
  binding {
    role = "roles/run.invoker"
    members = [
      "allUsers",
    ]
  }
}

resource "google_cloud_run_service_iam_policy" "noauth" {
  location = google_cloud_run_service.default.location
  project  = google_cloud_run_service.default.project
  service  = google_cloud_run_service.default.name

  policy_data = data.google_iam_policy.noauth.policy_data
} 
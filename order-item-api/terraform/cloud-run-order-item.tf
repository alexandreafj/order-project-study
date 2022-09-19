terraform {
  required_providers {
    google = {
      source = "hashicorp/google"
      version = "4.36.0"
    }
  }
  backend "remote" {
    organization = var.tf_organization_name

    workspaces {
      name = var.tf_workspace_name
    }
  }
}

provider "google" {
  project = var.gcp_project
  region  = var.gcp_region

}

resource "google_project_service" "run_api" {
  service = "run.googleapis.com"
}

resource "google_cloud_run_service" "default" {
  provider = google
  name     = "api-order-item"
  location = var.gcp_region

  template {
    spec {
      containers {
        image = var.container_registry_docker_image
        env {
          name  = "PORT"
          value = 8080
        }
        env {
          name = "MYSQL_HOST"
          value = var.mysql_host
        }
        env {
          name = "MYSQL_PORT"
          value = "3306"
        }
        env {
          name = "REDIS_HOST"
          value = var.redis_host
        }
        env {
          name = "REDIS_PORT"
          value = "6379"
        }
        env {
          name = "REDIS_NAMESPACE"
          value = "order-item-api"
        }
        env {
          name = "NODE_ENV"
          value = "production"
        }
        ports {
          name           = "http1"
          container_port = "8080"
          protocol       = "TCP"
        }
        resources {
          limits = {
            "cpu"    = "1000m"
            "memory" = "256Mi"
          }
          requests = {
            "cpu"    = "1000m"
            "memory" = "128Mi"
          }
        }
      }
      timeout_seconds = 30
    }

    metadata {
      annotations = {
        "autoscaling.knative.dev/maxScale" = "4"
      }
    }
  }

  metadata {
    annotations = {
      cloud-run                           = "order-item"
      "run.googleapis.com/ingress"        = "all"
      "run.googleapis.com/ingress-status" = "all"
    }
  }

  traffic {
    percent         = 100
    latest_revision = true
  }

  depends_on                 = [google_project_service.run_api, google_secret_manager_secret_version.secret-version-data]
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
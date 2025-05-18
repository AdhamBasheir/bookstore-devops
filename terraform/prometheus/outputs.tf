output "prometheus_loadbalancer_url" {
  description = "The external URL of Prometheus"
  value       = data.kubernetes_service.prometheus_server.status[0].load_balancer[0].ingress[0].hostname
}

output "prometheus_service_name" {
  value = data.kubernetes_service.prometheus_server.metadata[0].name
}

output "prometheus_service_namespace" {
  value = data.kubernetes_service.prometheus_server.metadata[0].namespace
}

output "prometheus_service_type" {
  value = data.kubernetes_service.prometheus_server.spec[0].type
}

output "prometheus_namespace" {
  value = helm_release.prometheus.namespace
}

output "prometheus_chart" {
  value = helm_release.prometheus.chart
}

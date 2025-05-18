output "argocd_namespace" {
  value = helm_release.argocd.namespace
}

output "argocd_chart_version" {
  value = helm_release.argocd.chart
}

output "argocd_url" {
  value = helm_release.argocd.name
}

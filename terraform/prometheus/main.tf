resource "helm_release" "prometheus" {
  name             = "prometheus"
  repository       = "https://prometheus-community.github.io/helm-charts"
  chart            = "prometheus"
  namespace        = "monitoring"
  version          = "58.6.0"
  create_namespace = true

  values = [
    file("${path.module}/prometheus-values.yaml")
  ]
}

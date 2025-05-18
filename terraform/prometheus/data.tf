data "aws_eks_cluster_auth" "cluster" {
  name = var.cluster_name
}

data "kubernetes_service" "prometheus_server" {
  metadata {
    name      = "prometheus-server"
    namespace = "monitoring"
  }

  depends_on = [helm_release.prometheus]
}

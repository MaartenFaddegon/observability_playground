kind create cluster --config cluster-config.yaml
tilt up


If you get the following error:
  found in Chart.yaml, but missing in charts/ directory: ingress-nginx
you may need to run
  cd ingress-nginx/
  helm dependency update

update_settings(k8s_upsert_timeout_secs = 120)

load('ext://helm_resource', 'helm_resource', 'helm_repo')

print('Hello from Maartens Tiltfile')

# Install ingress-nginx
helm_resource(
  name='ingress-nginx', 
  chart='./ingress-nginx',
  namespace='ingress-nginx',
  flags=['--dependency-update', '--create-namespace'],
  labels=['Infrastructure'],
)

# Install kube-prometheus-stack
helm_resource(
  name='kube-prometheus-stack', 
  chart='./kube-prometheus-stack',
  namespace='monitoring',
  flags=['--dependency-update', '--create-namespace'],
  labels=['Infrastructure'],
  resource_deps=['ingress-nginx'],
)
k8s_resource('kube-prometheus-stack', links=['grafana.localhost', 'prometheus.localhost'])

# Install the todo-backend
docker_build('todo-backend', '.', dockerfile='docker/todobackend.Dockerfile')
k8s_yaml(helm('./deploy-todo-backend'))

# Install the todo-frontend
docker_build('todo-frontend', '.', dockerfile='docker/todofrontend.Dockerfile')
k8s_yaml(helm('./deploy-todo-frontend'))
k8s_resource('todo-frontend', links=['todo-frontend.localhost'])

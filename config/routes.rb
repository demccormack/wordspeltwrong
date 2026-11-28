Rails.application.routes.draw do
  # Health check for load balancers and uptime monitors.
  get "up" => "rails/health#show", as: :rails_health_check

  root "pages#home"
  get "science-of-flatness", to: "pages#science_of_flatness", as: :science_of_flatness
end

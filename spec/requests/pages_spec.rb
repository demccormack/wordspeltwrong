require "rails_helper"

RSpec.describe "Pages", type: :request do
  it "serves the landing page" do
    get root_path

    expect(response).to have_http_status(:ok)
    expect(response.body).to include("1% flatter")
  end
end

require "rails_helper"

RSpec.describe "Pages", type: :request do
  it "serves the landing page" do
    get root_path

    expect(response).to have_http_status(:ok)
    expect(response.body).to include("1% flatter")
    expect(response.body).to include("Continue anonymously")
    expect(response.body).to include("Your progress is saved only in this browser")
    expect(response.body).to include("Reset local progress")
  end

  it "serves the science of flatness" do
    get science_of_flatness_path

    expect(response).to have_http_status(:ok)
    expect(response.body).to include("The Science of Flatness", "Hierarchical Entropy", "Subpancake territory")
  end
end

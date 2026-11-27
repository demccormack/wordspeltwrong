require "rails_helper"

RSpec.describe "Landing page", type: :system do
  before { driven_by(:rack_test) }

  it "shows the brand and slogan" do
    visit root_path

    expect(page).to have_link("wordspeltwrong.io")
    expect(page).to have_content("1% flatter every day.")
    expect(page).to have_button("Celebrate again", count: 0)
  end
end

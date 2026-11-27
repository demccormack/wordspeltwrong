require "rails_helper"

RSpec.describe "Landing page", type: :system do
  before { driven_by(:rack_test) }

  it "shows the brand and slogan" do
    visit root_path

    expect(page).to have_link("wordspeltwrong.io")
    expect(page).to have_content("1% flatter every day.")
    expect(page).to have_button("Celebrate again", count: 0)
    expect(page).to have_button("✨ Get started ✨")
    expect(page).to have_content("No account. No email.")
  end

  it "offers an anonymous onboarding journey and local profile controls" do
    visit root_path

    click_button "✨ Get started ✨"
    expect(page).to have_field("Your preferred name")
    click_button "Continue anonymously"
    expect(page).to have_content("How many years of experience do you have being yourself?")
    expect(page).to have_content("Your relationship with innovation?")
    expect(page).to have_button("✨ Align me with the organisation ✨")
    expect(page).to have_content("Your profile and achievements are stored on this device only.")
    expect(page).to have_button("Reset local progress")
  end
end

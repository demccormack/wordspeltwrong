require "rails_helper"

RSpec.describe "Landing page", type: :system do
  before { driven_by(:selenium, using: :headless_chrome) }

  it "shows the brand and slogan" do
    visit root_path

    expect(page).to have_link("wordspeltwrong.io")
    expect(page).to have_content("1% flatter every day.")
    expect(page).to have_button("Celebrate again", count: 0)
    expect(page).to have_button("✨ Get started ✨")
    expect(page).to have_content("No account. No email.")
  end

  it "completes onboarding anonymously and keeps the profile in this browser" do
    visit root_path

    click_button "✨ Get started ✨"
    fill_in "Your preferred name", with: "Taylor"
    click_button "Continue to alignment"
    expect(page).to have_content("How many years of experience do you have being yourself?")
    select "6–10 years", from: "How many years of experience do you have being yourself?"
    select "Innovation is a mindset (and a slide deck)", from: "Your relationship with innovation?"
    click_button "✨ Align me with the organisation ✨"
    expect(page).to have_content("Welcome, Taylor")
    expect(page).to have_content("Founding Stakeholder")
    expect(page).to have_content("Your progress is saved only in this browser")

    click_button "Flatten by 1%"
    expect(page).to have_content("74%")
    expect(page).to have_content("1% Flatter")
    click_button "My profile"
    expect(page).to have_content("Taylor")
    expect(page).to have_content("6–10 years")
    expect(page).to have_content("Director of Strategic Flatness")
    expect(page).to have_content("Your profile and achievements are stored on this device only.")
    expect(page).to have_button("Reset local progress")

    page.refresh
    expect(page).to have_content("Welcome, Taylor")
    click_button "My profile"
    click_button "Reset local progress"
    expect(page).to have_button("✨ Get started ✨")
    page.refresh
    expect(page).to have_button("✨ Get started ✨")
  end

  it "continues when saved browser state is corrupt or from an older version" do
    visit root_path
    page.execute_script("localStorage.setItem('wordspeltwrong.visitor', '{broken')")
    page.refresh
    expect(page).to have_button("✨ Get started ✨")

    page.execute_script("localStorage.setItem('wordspeltwrong.visitor', JSON.stringify({ version: 0 }))")
    page.refresh
    expect(page).to have_button("✨ Get started ✨")
  end

  it "lets a visitor stay anonymous and skips optional personalisation" do
    visit root_path
    click_button "✨ Get started ✨"
    click_button "Continue anonymously"
    click_button "✨ Align me with the organisation ✨"

    expect(page).to have_content("Welcome, Stakeholder")
    click_button "My profile"
    expect(page).to have_content("Anonymous Stakeholder")
    expect(page).to have_content("Not quantified")
    expect(page).to have_content("We’ll discover this together")
  end
end

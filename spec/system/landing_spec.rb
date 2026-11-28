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

  it "asks one question at a time and keeps the personalised profile in this browser" do
    visit root_path

    click_button "✨ Get started ✨"
    fill_in "Your preferred name", with: "Taylor"
    click_button "Continue to alignment"
    expect(page).to have_content("Taylor, we're so glad you're here.")
    expect(page).to have_field("How many years of experience do you have being yourself?", visible: true)
    expect(page).to have_field("Your relationship with innovation?", visible: false)
    select "6–10 years", from: "How many years of experience do you have being yourself?"
    click_button "Continue →"
    expect(page).to have_css("h1.text-3xl", text: "Thank you for trusting us, it means a lot.")
    expect(page).to have_field("Your relationship with innovation?", visible: true)
    expect(page).to have_field("Preferred level of organisational flatness?", visible: false)
    select "Innovation is a mindset (and a slide deck)", from: "Your relationship with innovation?"
    click_button "Continue →"
    expect(page).to have_css("h1.text-3xl", text: "We'll take it from here, together.")
    expect(page).to have_field("Preferred level of organisational flatness?", visible: true)
    select "Strategically pancake-adjacent", from: "Preferred level of organisational flatness?"
    click_button "Continue →"
    expect(page).to have_css("h1.text-3xl", text: "We love your commitment to a flatter future.")
    expect(page).to have_field("What is your favourite weather?", visible: true)
    select "Sunny with scattered stakeholders", from: "What is your favourite weather?"
    click_button "✨ Align me with the organisation ✨"
    expect(page).to have_content("Welcome, Taylor")
    expect(page).to have_content("Founding Stakeholder")
    expect(page).to have_content("Your progress is saved only in this browser")

    click_button "Flatten by 1%"
    expect(page).to have_content("732.70 mPc")
    expect(page).to have_content("+2.70 mPc")
    expect(page).to have_button("Flatten by 1%", disabled: true)
    expect(page).to have_content("Deliberate flattening")
    expect(page).to have_content("1% Flatter")
    click_button "My profile"
    expect(page).to have_content("Taylor")
    expect(page).to have_content("6–10 years")
    expect(page).to have_content("Director of Strategic Flatness")
    expect(page).to have_content("Your profile and achievements are stored on this device only.")
    expect(page).to have_button("Reset local progress")

    page.refresh
    expect(page).to have_content("Welcome, Taylor")
    expect(page).to have_content("732.70 mPc")
    expect(page).to have_button("Flatten by 1%", disabled: true)
    click_link "Learn about the science behind organisational flatness"
    expect(page).to have_content("The Science of Flatness")
    expect(page).to have_content("The Principle of Unbounded Dysfunction")
    click_link "Back to your organisation"
    click_button "My profile"
    click_button "Reset local progress"
    expect(page).to have_button("✨ Get started ✨")
    page.refresh
    expect(page).to have_button("✨ Get started ✨")
  end

  it "accounts for entropy on return and celebrates recovery from the bread domain" do
    visit root_path
    click_button "✨ Get started ✨"
    click_button "Continue anonymously"
    3.times { click_button "Continue →" }
    click_button "✨ Align me with the organisation ✨"

    page.execute_script(<<~JS)
      const state = JSON.parse(localStorage.getItem('wordspeltwrong.visitor'));
      state.progress.establishedAt = new Date(Date.now() - 131 * 7 * 86400000).toISOString();
      localStorage.setItem('wordspeltwrong.visitor', JSON.stringify(state));
    JS
    page.refresh
    expect(page).to have_content("Ciabatta")
    expect(page).to have_content("131 events")
    expect(page).to have_content("Hierarchical Entropy")
    expect(page).to have_content("-7.29 mPc")
    click_button "Flatten by 1%"
    expect(page).to have_content("American pancake")
    expect(page).to have_content("returned from the bread domain")
    page.refresh
    expect(page).to have_content("American pancake")
    expect(page).to have_button("Flatten by 1%", disabled: true)
    expect(page).to have_content("131 events", count: 1)
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
    expect(page).to have_content("We're so glad you're here.")
    click_button "Continue →"
    expect(page).to have_css("h1.text-3xl", text: "Thank you for trusting us, it means a lot.")
    click_button "Continue →"
    click_button "Continue →"
    click_button "✨ Align me with the organisation ✨"

    expect(page).to have_content("Welcome, Stakeholder")
    click_button "My profile"
    expect(page).to have_content("Anonymous Stakeholder")
    expect(page).to have_content("Not quantified")
    expect(page).to have_content("We’ll discover this together")
  end
end

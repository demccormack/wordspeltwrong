# TODO: Remove once Capybara ships a fix for Chrome 158+ rejecting the "*" origin
# in Storage.clearDataForOrigin (https://github.com/teamcapybara/capybara/issues/2865).
# Dependabot will open a Capybara bump PR when a fixed release is published.
module CapybaraChromeReset
  def reset!
    return unless @browser

    begin
      execute_script("window.localStorage.clear(); window.sessionStorage.clear()")
    rescue Selenium::WebDriver::Error::WebDriverError
      nil
    end
    super
  end

  def execute_cdp(cmd, params = {})
    if cmd == "Storage.clearDataForOrigin" && params[:origin] == "*"
      # Cookies are all Capybara's "*" clear still needs; storage is cleared in reset! above.
      return super("Network.clearBrowserCookies")
    end

    super
  end
end

Capybara::Selenium::Driver::ChromeDriver.prepend(CapybaraChromeReset)

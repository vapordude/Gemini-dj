from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    page.goto('http://localhost:3000')
    page.wait_for_selector('button:has-text("TRANSITION")')
    page.locator('button:has-text("TRANSITION")').screenshot(path='transition-button.png')
    browser.close()

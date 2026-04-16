from playwright.sync_api import sync_playwright
import time
import os

os.makedirs('/home/jules/verification/screenshots', exist_ok=True)

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page()
    page.goto('http://localhost:3000')
    time.sleep(2)
    page.screenshot(path='/home/jules/verification/screenshots/ui_changes.png')
    browser.close()

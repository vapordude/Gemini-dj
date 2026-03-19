from playwright.sync_api import sync_playwright

def verify_feature(page):
  page.goto("http://localhost:3000")
  page.wait_for_timeout(500)

  # Check if tabs have correct aria attributes
  search_tab = page.get_by_role("tab", name="Search")
  search_tab.wait_for(state="visible")

  playlists_tab = page.get_by_role("tab", name="Playlists")
  playlists_tab.wait_for(state="visible")

  songs_tab = page.get_by_role("tab", name="Songs")
  songs_tab.wait_for(state="visible")

  artists_tab = page.get_by_role("tab", name="Artists")
  artists_tab.wait_for(state="visible")

  # Press Tab key multiple times to see focus indicators on the tabs
  page.keyboard.press("Tab")
  page.wait_for_timeout(500)
  page.keyboard.press("Tab")
  page.wait_for_timeout(500)
  page.keyboard.press("Tab")
  page.wait_for_timeout(500)
  page.keyboard.press("Tab")
  page.wait_for_timeout(500)
  page.keyboard.press("Tab")
  page.wait_for_timeout(500)

  page.screenshot(path="/tmp/verification.png")

if __name__ == "__main__":
  with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    context = browser.new_context(record_video_dir="/tmp/video")
    page = context.new_page()
    try:
      verify_feature(page)
    finally:
      context.close()
      browser.close()

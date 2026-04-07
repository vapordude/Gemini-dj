from playwright.sync_api import sync_playwright, expect
import time

def verify_ux_changes():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # 1. Start App
        page.goto("http://localhost:3000")
        time.sleep(2) # Wait for initial load

        # 2. Verify Library Tabs
        print("Verifying Library Tabs...")
        search_tab = page.locator("button[aria-label='Search Library']")
        playlists_tab = page.locator("button[aria-label='Playlists']")
        songs_tab = page.locator("button[aria-label='Songs']")
        artists_tab = page.locator("button[aria-label='Artists']")

        expect(search_tab).to_be_visible()
        expect(playlists_tab).to_be_visible()
        expect(songs_tab).to_be_visible()
        expect(artists_tab).to_be_visible()
        print("Library Tabs Verified.")

        # 3. Verify Deck Play/Pause
        print("Verifying Deck Play/Pause...")
        play_buttons = page.locator("button[aria-label='Play Track']")
        expect(play_buttons.first).to_be_visible()
        print("Deck Play/Pause Verified.")

        # 4. Verify Transition Button
        print("Verifying Transition Button...")
        transition_btn = page.locator("button", has_text="TRANSITION")
        expect(transition_btn).to_be_disabled()
        expect(transition_btn).to_have_attribute("title", "Requires track on both decks")
        print("Transition Button Verified.")

        # 5. Verify DJ Chat Toggle
        print("Verifying DJ Chat...")
        chat_toggle = page.locator("button[aria-label='Open DJ Chat']")
        expect(chat_toggle).to_be_visible()
        chat_toggle.click()
        time.sleep(1) # wait for animation

        chat_close = page.locator("button[aria-label='Close DJ Chat']")
        expect(chat_close).to_be_visible()

        chat_send = page.locator("button[aria-label='Send Message']")
        expect(chat_send).to_be_visible()
        print("DJ Chat Verified.")

        # Take a screenshot of the open chat and UI state
        page.screenshot(path="verification.png", full_page=True)
        print("Screenshot taken.")

        browser.close()

if __name__ == "__main__":
    verify_ux_changes()

import os
import time
from playwright.sync_api import sync_playwright

def verify_ui():
    videos_dir = "/home/jules/verification/videos"
    screenshots_dir = "/home/jules/verification/screenshots"
    os.makedirs(videos_dir, exist_ok=True)
    os.makedirs(screenshots_dir, exist_ok=True)

    with sync_playwright() as p:
        browser = p.chromium.launch()
        context = browser.new_context(
            record_video_dir=videos_dir,
            viewport={'width': 1280, 'height': 800}
        )
        page = context.new_page()

        try:
            print("Navigating to app...")
            page.goto('http://localhost:3000')
            page.wait_for_load_state('networkidle')

            # Wait for transition button
            transition_btn = page.locator('button', has_text='TRANSITION')
            transition_btn.wait_for(state='visible')

            # Hover over the button to show the tooltip and cursor
            print("Hovering over transition button...")
            transition_btn.hover()

            # Focus the button to check keyboard styles
            print("Focusing transition button...")
            transition_btn.focus()

            # Take screenshot
            screenshot_path = os.path.join(screenshots_dir, 'transition_button_states.png')
            page.screenshot(path=screenshot_path, full_page=True)
            print(f"Screenshot saved to {screenshot_path}")

        except Exception as e:
            print(f"Error: {e}")
        finally:
            context.close()
            browser.close()

if __name__ == "__main__":
    verify_ui()

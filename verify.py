import asyncio
from playwright.async_api import async_playwright
import time

async def verify():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        # Record video
        context = await browser.new_context(
            record_video_dir="/home/jules/verification/videos/",
            record_video_size={"width": 1280, "height": 720}
        )
        page = await context.new_page()

        # Wait for dev server to start
        max_retries = 10
        for i in range(max_retries):
            try:
                await page.goto('http://localhost:3000', wait_until='networkidle')
                break
            except Exception as e:
                print(f"Waiting for server... ({i+1}/{max_retries})")
                time.sleep(1)

        if i == max_retries - 1:
            print("Server didn't start in time.")
            return

        print("Page loaded.")

        # Give it a bit more time to render
        await asyncio.sleep(2)

        # 1. Focus on Load Track Deck A
        print("Focusing Load Track Deck A")
        load_track_a = page.get_by_label("Load Track to Deck A")
        if await load_track_a.count() > 0:
            await load_track_a.focus()
            await asyncio.sleep(0.5)
            await page.screenshot(path='/home/jules/verification/screenshots/load-track-focus-a.png')
        else:
            print("Could not find Load Track Deck A")

        # 2. Focus on Play Deck A
        print("Focusing Play Deck A")
        play_a = page.get_by_label("Play Deck A")
        if await play_a.count() > 0:
            await play_a.focus()
            await asyncio.sleep(0.5)
            await page.screenshot(path='/home/jules/verification/screenshots/play-focus-a.png')
        else:
            print("Could not find Play Deck A")

        # 3. Focus on Sync Deck A
        print("Focusing Sync Deck A")
        sync_a = page.get_by_label("Sync Deck A")
        if await sync_a.count() > 0:
            await sync_a.focus()
            await asyncio.sleep(0.5)
            await page.screenshot(path='/home/jules/verification/screenshots/sync-focus-a.png')
        else:
            print("Could not find Sync Deck A")

        # 4. Focus on Loop Deck A
        print("Focusing Loop Deck A")
        loop_a = page.get_by_label("Loop Deck A")
        if await loop_a.count() > 0:
            await loop_a.focus()
            await asyncio.sleep(0.5)
            await page.screenshot(path='/home/jules/verification/screenshots/loop-focus-a.png')
        else:
            print("Could not find Loop Deck A")

        # Give time for video to flush
        await context.close()
        await browser.close()
        print("Done!")

asyncio.run(verify())

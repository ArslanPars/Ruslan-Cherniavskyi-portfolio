import asyncio
from playwright.async_api import async_playwright, expect

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()

        # Listen for console events
        page.on("console", lambda msg: print(f"Browser console: {msg.text()}"))

        await page.goto('http://localhost:8000')

        # Wait for the gallery to be populated
        await page.wait_for_selector('.card')

        # Screenshot of the main page
        await page.screenshot(path='jules-scratch/verification/01_main_page.png')

        # Click the first card
        await page.locator('.card').first.click()

        # Wait for the modal to be visible
        await expect(page.locator('#viewer-modal')).to_be_visible()

        # Wait for the 3D model to load (wait for canvas to be rendered)
        await page.wait_for_selector('#viewer-container canvas')

        # Wait for the gallery in the modal to be populated
        await page.wait_for_selector('#modal-gallery-container img')


        # Screenshot of the modal
        await page.screenshot(path='jules-scratch/verification/02_modal.png')

        # Click the first image in the modal gallery
        await page.locator('#modal-gallery-container img').first.click()

        # Wait for the lightbox to be visible
        await expect(page.locator('.modal[style*="z-index: 1001"]')).to_be_visible()

        # Screenshot of the lightbox
        await page.screenshot(path='jules-scratch/verification/03_lightbox.png')

        await browser.close()

asyncio.run(main())

import asyncio
from playwright.async_api import async_playwright
import os

async def main():
    # define target pages
    pages = [
        "index.html",
        "login.html",
        "profile.html",
        "attendance.html",
        "student-fees.html",
        "admin.html",
        "admin-classes.html"
    ]
    
    base_dir = r"d:\newprojectworknamansaini\fee3sem"
    screenshot_dir = os.path.join(base_dir, "screenshots", "mobile")
    os.makedirs(screenshot_dir, exist_ok=True)
    
    async with async_playwright() as p:
        # Launch browser
        browser = await p.chromium.launch()
        
        # Create a mobile context (iPhone 13 dimensions)
        context = await browser.new_context(
            viewport={'width': 390, 'height': 844},
            user_agent='Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1'
        )
        
        page = await context.new_page()
        
        for p_name in pages:
            file_url = f"file:///{base_dir}/{p_name}".replace("\\", "/")
            try:
                print(f"Capturing mobile view for {p_name}...")
                
                # First go to a page to set localstorage (about:blank works in some browsers, but let's go to index.html first)
                await page.goto(file_url)
                
                if p_name in ["profile.html", "attendance.html", "student-fees.html"]:
                    await page.evaluate("localStorage.setItem('userRole', 'student'); localStorage.setItem('username', 'Test Student');")
                    await page.goto(file_url) # reload with localstorage
                    await page.wait_for_timeout(1000)
                elif p_name in ["admin.html", "admin-classes.html"]:
                    await page.evaluate("localStorage.setItem('userRole', 'admin'); localStorage.setItem('username', 'Test Admin');")
                    await page.goto(file_url) # reload with localstorage
                    await page.wait_for_timeout(1000)
                else:
                    await page.wait_for_timeout(1000)
                
                await page.screenshot(path=os.path.join(screenshot_dir, f"mobile_{p_name}.png"), full_page=True)
            except Exception as e:
                print(f"Error capturing {p_name}: {e}")
                
        await browser.close()

if __name__ == "__main__":
    asyncio.run(main())

class Scroller {
	constructor(parentQuery) {
		this.parentEl = document.querySelector(parentQuery);
		this.pages = []; // html element []
		this.currentPage = null; // html element
		this.isScrolling = false;
		this.lastScrollPosition = window.pageYOffset;
		this.scrollTimeout = 400;
		this.touchStart = null; // { x: number, y: number }
		this.initPages();
		this.initScrollWheelBehavior();
		this.initTouchScrollBehavior();
		this.initWindowResizeBehavior();
	}

	initWindowResizeBehavior() {
		window.addEventListener("resize", () => {
			requestAnimationFrame(() => {
				if (!this.isScrolling)
					this.currentPage.scrollIntoView(true);
			})
		})
	}

	initPages() {
		this.pages = this.parentEl.querySelectorAll("section");
		const { pages } = this;

		for (var i = 0; i < pages.length; ++i) {
			const page = pages[i];
			page.previousPage = i > 0 ? pages[i - 1] : null;
			page.nextPage = i < pages.length - 1 ? pages[i + 1] : null;
			page.pageIndex = i;
		}
		this.currentPage = pages[0];
	}

	initScrollWheelBehavior(timeout = 400) {
		window.addEventListener("wheel", (event) => {
			event.preventDefault();
			event.stopPropagation();
			const deltaY = event.deltaY;
			if (deltaY === 0)
				return;

			if (deltaY > 0)
				this.scrollDown();
			else if (deltaY < 0)
				this.scrollUp();
		})
	}

	initTouchScrollBehavior() {
		window.addEventListener("touchstart", (event) => {
			const touch = event.touches[0];
			this.touchStart = {
				x: touch.clientX,
				y: touch.clientY
			}
		})
		window.addEventListener("touchend", event => {
			this.touchStart = null;
		})
		window.addEventListener("touchmove", event => {
			if (!this.touchStart)
				return;
			
			const touchEvent = event.touches[0];
			const touch = { x: touchEvent.clientX, y: touchEvent.clientY };
			const diff = { x: touchStart.x - touch.x, y: touchStart.y - touch.y }
			if (diff.y > 0)
				this.scrollDown();
			else
				this.scrollUp();
		})
	}

	scrollDown() {
		this.scrollToPage(this.currentPage.nextPage);
	}

	scrollUp() {
		this.scrollToPage(this.currentPage.previousPage);
	}

	scrollToPage(page) {
		if (!page || this.isScrolling)
			return;
		this.currentPage = page
		page.scrollIntoView(true);
		this.isScrolling = true;
		setTimeout(() => {this.isScrolling = false}, this.scrollTimeout);
	}
}

export default Scroller;
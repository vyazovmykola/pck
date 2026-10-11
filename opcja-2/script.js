(function () {
  var copies = Array.prototype.slice.call(document.querySelectorAll('[data-story-copy]'));
  var panels = Array.prototype.slice.call(document.querySelectorAll('[data-story-panel]'));
  var progress = Array.prototype.slice.call(document.querySelectorAll('.visual-progress i'));
  var story = document.querySelector('.story');

  function setStory(index) {
    copies.forEach(function (item, itemIndex) { item.classList.toggle('is-active', itemIndex === index); });
    panels.forEach(function (item, itemIndex) { item.classList.toggle('is-active', itemIndex === index); });
    progress.forEach(function (item, itemIndex) { item.classList.toggle('active', itemIndex === index); });
  }

  function updateStory() {
    if (!story) return;
    var storyTop = story.offsetTop;
    var usableHeight = Math.max(story.offsetHeight - window.innerHeight, 1);
    var progressValue = Math.min(Math.max((window.scrollY - storyTop) / usableHeight, 0), 0.999);
    setStory(Math.min(Math.floor(progressValue * copies.length), copies.length - 1));
  }

  setStory(0);
  window.addEventListener('scroll', updateStory, { passive: true });
  window.addEventListener('resize', updateStory);

  var revealItems = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
    revealItems.forEach(function (item) { item.classList.add('is-visible'); });
  } else {
    var observer = new IntersectionObserver(function (entries, instance) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          instance.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealItems.forEach(function (item) { observer.observe(item); });
  }
})();

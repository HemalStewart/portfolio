// Each chapter is one seek-friendly film, with at most three decoders retained.
export function createMediaScrubber(container) {
  const slots = new Map();
  const mobile = matchMedia('(max-width: 700px)').matches;
  const poster = document.createElement('img');
  poster.className = 'motion-poster';
  poster.alt = '';
  container.append(poster);
  let wanted = '', progress = 0, clock = 0, shown = '';
  function reveal(slot) {
    if (slot.key !== wanted || slot.video.readyState < 2) return;
    if (shown !== slot.key) {
      for (const other of slots.values()) other.video.style.opacity = other === slot ? '1' : '0';
      shown = slot.key;
      poster.style.opacity = '0';
    }
    container.dataset.scene = slot.key;
    container.dataset.presentedTime = slot.video.currentTime.toFixed(3);
  }
  function seek(slot) {
    const video = slot.video;
    if (slot.key !== wanted || video.readyState < 2 || !Number.isFinite(video.duration) || video.seeking) return;
    const target = progress * Math.max(0, video.duration - 1 / 48);
    if (Math.abs(video.currentTime - target) > 1 / 60) {
      video.currentTime = target;
    } else reveal(slot);
  }
  function get(key) {
    let slot = slots.get(key);
    if (slot) { slot.used = ++clock; return slot; }
    // Reuse compressed browser cache, release old decoder and buffered media.
    if (slots.size >= 3) {
      const oldest = [...slots.values()].filter(s => s.key !== wanted && s.key !== shown).sort((a,b) => a.used - b.used)[0];
      if (oldest) {
        oldest.video.removeAttribute('src'); oldest.video.load(); oldest.video.remove(); slots.delete(oldest.key);
      }
    }
    const video = document.createElement('video');
    video.muted = true; video.playsInline = true; video.preload = 'auto';
    video.setAttribute('aria-hidden', 'true');
    video.className = 'motion-clip';
    video.style.opacity = '0';
    slot = { key, video, used: ++clock };
    slots.set(key, slot);
    const ready = new Promise(resolve => {
      video.addEventListener('loadeddata', () => { seek(slot); resolve(); }, {once:true});
      video.addEventListener('error', resolve, {once:true});
    });
    video.addEventListener('seeked', () => { reveal(slot); seek(slot); });
    video.addEventListener('canplay', () => seek(slot));
    slot.ready = ready;
    container.append(video);
    video.src = `motion-media/${key}-${mobile ? 'mobile' : 'desktop'}.mp4`;
    return slot;
  }
  return {
    prepare(key) { return get(key).ready; },
    prefetch(key) { if (key && (!wanted || shown === wanted)) get(key); },
    show(key, value) {
      progress = value;
      if (wanted !== key) {
        wanted = key;
        shown = '';
        for (const other of slots.values()) other.video.style.opacity = '0';
        poster.src = `reference-media/${key}/f_001.webp`;
        poster.style.opacity = '1';
      }
      const slot = get(key);
      seek(slot);
    },
    hide() { container.style.opacity = '0'; },
    visible() { container.style.opacity = '1'; },
  };
}

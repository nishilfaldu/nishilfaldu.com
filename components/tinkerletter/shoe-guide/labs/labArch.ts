export const labArchHtml = `<div class="archlab">
    <figure class="plate archlab-print">
      <svg id="lab-print" viewBox="0 0 120 260" role="img" aria-label="Interactive wet footprint whose arch band changes with the slider"></svg>
      <figcaption class="plate-label">the print — drag the slider</figcaption>
    </figure>
    <div class="archlab-controls">
      <div class="arch-reading" id="arch-reading" aria-live="polite"></div>
      <div class="arch-sub" id="arch-sub"></div>
      <div class="slider-block">
        <label for="arch-slider">Arch height</label>
        <input type="range" id="arch-slider" min="0" max="100" value="50" aria-describedby="arch-reading">
        <div class="slider-scale"><span>Flat</span><span>Neutral</span><span>High</span></div>
        <div class="slider-marks">
          <span class="mark" style="left:50%">most people land here</span>
        </div>
      </div>
    </div>
  </div>

  `;

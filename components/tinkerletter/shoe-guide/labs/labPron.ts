export const labPronHtml = `<div class="pronlab">
    <div class="pron-tabs" role="tablist" aria-label="Ankle tilt after landing">
      <button role="tab" id="ptab-sup" aria-selected="false">Tips outward</button>
      <button role="tab" id="ptab-neu" aria-selected="true">Stays level</button>
      <button role="tab" id="ptab-over" aria-selected="false">Tips inward</button>
    </div>
    <div class="pron-body">
      <div class="pron-cell">
        <h5>Left heel, seen from behind</h5>
        <svg id="pron-leg" viewBox="0 0 200 220" aria-hidden="true"></svg>
      </div>
      <div class="pron-cell">
        <h5>Same foot's sole, after years</h5>
        <svg id="pron-sole" viewBox="0 0 150 320" aria-hidden="true"></svg>
      </div>
      <div class="pron-cell txt" id="pron-text" aria-live="polite"></div>
    </div>
  </div>

  `;

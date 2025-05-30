const supabase = window.supabase.createClient(
  'https://zzzeefuzaqoigfgbaqft.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp6emVlZnV6YXFvaWdmZ2JhcWZ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1OTQzMTMsImV4cCI6MjA2NDE3MDMxM30.fGOFIW5jsRF-xoFyf5Oli485eyCDC-4F87FmQIT5Lmw'
);

// Logic for view.html
if (document.location.pathname.includes('view.html')) {
  (async () => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    const letterBox = document.getElementById('letter');

    if (!id) {
      letterBox.textContent = "❌ No letter ID provided.";
      return;
    }

    const { data, error } = await supabase
      .from('letters')
      .select('content')
      .eq('id', id)
      .single();

    if (error || !data) {
      console.error(error);
      letterBox.textContent = "❌ Could not load the letter.";
      return;
    }

    letterBox.textContent = data.content;
  })();
}

// Logic for index.html
if (document.location.pathname.includes('index.html') || document.location.pathname.endsWith('/')) {
  window.submitLetter = async function () {
    const content = document.getElementById('letter').value.trim();
    const linkDiv = document.getElementById('link');

    if (!content) {
      linkDiv.innerHTML = `<p class="text-red-600">✏️ Please write something before sending.</p>`;
      return;
    }

    const { data, error } = await supabase
      .from('letters')
      .insert([{ content }])
      .select()
      .single();

    if (error) {
      console.error(error);
      linkDiv.innerHTML = `<p class="text-red-600">❌ Failed to send your letter. Try again later.</p>`;
      return;
    }

    linkDiv.innerHTML = `
      <p class="text-green-700">✅ Letter sent successfully!</p>
      <a href="view.html?id=${data.id}" class="text-blue-600 underline">📄 View your letter</a>
    `;
  };
}

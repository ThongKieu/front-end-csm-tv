export const copyWorkSchedule = (work) => {
  const scheduleText = `
${work.date_book} ${work.name_cus}${work.phone_number} ${work.street}, ${
    work.district
  }${work.work_content}${work.work_note}
${work.worker_full_name ? `${work.worker_full_name} (${work.worker_code})` : ""}
  `.trim();

  // Fallback method using textarea
  const fallbackCopy = (text) => {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      const successful = document.execCommand('copy');
      textArea.remove();
      return successful;
    } catch (err) {
      console.error('Fallback: Oops, unable to copy', err);
      textArea.remove();
      return false;
    }
  };

  // Try using Clipboard API first
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(scheduleText)
      .then(() => {
    
        return true;
      })
      .catch((err) => {
        console.error('Failed to copy schedule:', err);
        // Fallback if Clipboard API fails
        return fallbackCopy(scheduleText);
      });
  } else {
    // Use fallback for non-secure contexts
    return Promise.resolve(fallbackCopy(scheduleText));
  }
};

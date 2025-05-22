export const copyWorkSchedule = (work) => {
  const scheduleText = `
📅 Lịch hẹn:
🕒 Thời gian: ${work.date_book}
👤 Khách hàng: ${work.name_cus}
📞 SĐT: ${work.phone_number}
📍 Địa chỉ: ${work.street}, ${work.district}
📝 Nội dung: ${work.work_content}
📌 Ghi chú: ${work.work_note}
${work.worker_full_name ? `👨‍🔧 Thợ: ${work.worker_full_name} (${work.worker_code})` : ''}
  `.trim()

  navigator.clipboard.writeText(scheduleText)
    .then(() => {
      // You can add a toast notification here if needed
      console.log('Schedule copied to clipboard')
    })
    .catch((err) => {
      console.error('Failed to copy schedule:', err)
    })
} 
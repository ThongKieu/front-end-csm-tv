export const ZNS_TEMPLATES = {
  QUOTATION: {
    id: 'quotation',
    name: 'Báo giá',
    description: 'Gửi báo giá cho khách hàng',
    template_id: '231677',
    tracking_id: '120199',
    requiredColumns: ['phone', 'name', 'date', 'code', 'warranty'],
    dataMapping: {
      phone: (row) => "84" + ((row.phone + "").startsWith("0") ? row.phone.substring(1, 10) : row.phone),
      template_id: '231677',
      template_data: (row) => ({
        date: row.date,
        code: row.code,
        customer_name: row.name,
        status: "Thành công",
        warranty: row.warranty
      }),
      tracking_id: '120199'
    }
  },
  THANK_YOU: {
    id: 'thank_you',
    name: 'Cảm ơn',
    description: 'Gửi lời cảm ơn sau khi hoàn thành dịch vụ',
    template_id: '231678',
    tracking_id: '120200',
    requiredColumns: ['phone', 'name', 'service'],
    dataMapping: {
      phone: (row) => "84" + ((row.phone + "").startsWith("0") ? row.phone.substring(1, 10) : row.phone),
      template_id: '231678',
      template_data: (row) => ({
        customer_name: row.name,
        service: row.service,
        status: "Hoàn thành"
      }),
      tracking_id: '120200'
    }
  },
  BULK_NOTIFICATION: {
    id: 'bulk_notification',
    name: 'Thông báo hàng loạt',
    description: 'Gửi thông báo cho nhiều khách hàng',
    template_id: '231679',
    tracking_id: '120201',
    requiredColumns: ['phone', 'name', 'message'],
    dataMapping: {
      phone: (row) => "84" + ((row.phone + "").startsWith("0") ? row.phone.substring(1, 10) : row.phone),
      template_id: '231679',
      template_data: (row) => ({
        customer_name: row.name,
        message: row.message
      }),
      tracking_id: '120201'
    }
  },
  SINGLE_NOTIFICATION: {
    id: 'single_notification',
    name: 'Thông báo đơn lẻ',
    description: 'Gửi thông báo cho một khách hàng',
    template_id: '231680',
    tracking_id: '120202',
    requiredColumns: ['phone', 'name', 'message'],
    dataMapping: {
      phone: (row) => "84" + ((row.phone + "").startsWith("0") ? row.phone.substring(1, 10) : row.phone),
      template_id: '231680',
      template_data: (row) => ({
        customer_name: row.name,
        message: row.message
      }),
      tracking_id: '120202'
    }
  }
} 
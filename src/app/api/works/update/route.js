import { NextResponse } from 'next/server';
export async function POST(request) {
  try {
    const body = await request.json();
    // Validate required fields based on test-api-field-mapping.js
    if (!body.job_id || body.job_id === null || body.job_id === undefined) {
      console.error('❌ Missing job_id:', body.job_id);
      return NextResponse.json(
        { message: 'job_id is required but not provided' },
        { status: 422 }
      );
    }

    // Prepare data for backend API according to validation requirements
    const updateData = {
      job_id: parseInt(body.job_id), // Must be integer
      user_id: body.user_id || 1, // Add user_id for job_log_logged_by_id (default to 1 if not provided)
      ...(body.job_content && { job_content: body.job_content }),
      ...(body.job_appointment_date && { job_appointment_date: body.job_appointment_date }),
      ...(body.job_customer_address && { job_customer_address: body.job_customer_address }),
      ...(body.job_customer_phone && { job_customer_phone: body.job_customer_phone }),
      ...(body.job_type_id && { job_type_id: parseInt(body.job_type_id) }), // Must be integer
      ...(body.job_source && { job_source: body.job_source }),
      ...(body.job_appointment_time && { job_appointment_time: body.job_appointment_time }),
      ...(body.job_customer_name && { job_customer_name: body.job_customer_name }),
      ...(body.job_customer_note && { job_customer_note: body.job_customer_note }),
      ...(body.job_priority && { job_priority: body.job_priority }),
    };
    // Call backend API
    const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://192.168.1.46';
    const apiUrl = `${backendUrl}/api/web/job/update`;
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(updateData),
      signal: AbortSignal.timeout(15000), // 15 seconds timeout
    });

    if (!response.ok) {
      console.error(`Backend responded with status: ${response.status}`);
      const errorText = await response.text();
      console.error('Backend error response:', errorText);
      
      // Handle 422 validation errors
      if (response.status === 422) {
        let errorMessage = 'Dữ liệu không hợp lệ';
        try {
          const errorData = JSON.parse(errorText);
          if (errorData.message) {
            errorMessage = errorData.message;
          } else if (errorData.errors && Array.isArray(errorData.errors)) {
            errorMessage = errorData.errors.map(err => err.message || err).join(', ');
          } else if (errorData.validation_errors) {
            errorMessage = Object.entries(errorData.validation_errors)
              .map(([field, errors]) => `${field}: ${errors.join(', ')}`)
              .join('; ');
          }
        } catch (parseError) {
          errorMessage = errorText;
        }
        
        return NextResponse.json(
          { message: `Lỗi validation: ${errorMessage}` },
          { status: 422 }
        );
      }
      
      throw new Error(`Backend responded with status: ${response.status}: ${errorText}`);
    }

    const result = await response.json();
    
    return NextResponse.json(result);
    
  } catch (error) {
    console.error('❌ Error updating work:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: `Lỗi cập nhật công việc: ${error.message}`,
        error: error.message 
      },
      { status: 500 }
    );
  }
}

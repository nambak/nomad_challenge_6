'use server'

export async function login(
  prevState: { success: boolean; message: string },
  formData: FormData
) {
  const password = formData.get('password') as string

  await new Promise((resolve) => setTimeout(resolve, 1500))

  if (password === '12345') {
    return { success: true, message: 'Welcome back!' }
  }

  return { success: false, message: 'Wrong password' }
}

import FormView from '@/components/FormView'

async function getFormJson() {
  const { TEST_SERVER_API } = process.env
  const res = await fetch(`${TEST_SERVER_API}/posts/1`)
  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }
  return [
    {
      checked: true,
      description: 'This is your public display name.',
      disabled: false,
      label: 'Username',
      name: 'name_8066618423',
      placeholder: 'shaden',
      required: true,
      rowIndex: 0,
      type: 'text',
      value: '',
      variant: 'Input',
    },
    {
      label: 'Age',
      name: 'age_12345',
      placeholder: 'Enter your age',
      required: true,
      rowIndex: 1,
      type: 'number',
      value: '',
      variant: 'Input',
    },
    {
      label: 'Agree to terms',
      name: 'terms_081',
      checked: false,
      required: true,
      rowIndex: 2,
      type: 'checkbox',
      variant: 'Checkbox',
    },
  ]
}

export default async function Home() {
  const formJsonData = await getFormJson()
  
  return (
    <section className="flex items-center justify-center h-screen">
      <FormView formJson={formJsonData} />
    </section>
  )
}

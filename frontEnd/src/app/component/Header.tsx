import React from 'react'
import { Input, Space, Button } from 'antd';
import type { GetProps } from 'antd';
const { Search } = Input;

type SearchProps = GetProps<typeof Input.Search>;
const onSearch: SearchProps['onSearch'] = (value, _e, info) => console.log(info?.source, value);

const Header = () => {
  return (
    <div className='sticky top-0 w-full p-6 bg-white rounded-md shadow-sm'>
      <div className='flex gap-4'>
        <Search placeholder="search" onSearch={onSearch} className='w-full'/>
        <Space direction='horizontal' className='gap-2'>
          <Button type='primary'>Login</Button>
          <Button>Register</Button>
        </Space>
      </div>
    </div>
  )
}

export default Header
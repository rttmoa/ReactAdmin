import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from 'antd'
import FixTabPanel from '@stateless/FixTabPanel'

// ! 与 coupons 重复
const Products = () => {
  const navigate = useNavigate()
  const redirectTo = (path) => {
    navigate(path)
  }
  // ? // ? http://localhost:8080/#/product
  return (
    <FixTabPanel>
      <Button type="primary" onClick={() => redirectTo('coupons/add')} style={{ margin: 10 }}>
        Add Coupons
      </Button>
      <Button onClick={() => redirectTo('coupons/edit?id=1')} style={{ margin: 10 }}>
        Edit Coupons
      </Button>
      <Button onClick={() => redirectTo('coupons/detail?id=2')} type="dashed" style={{ margin: 10 }}>
        Detail Coupons
      </Button>
    </FixTabPanel>
  )
}

export default Products

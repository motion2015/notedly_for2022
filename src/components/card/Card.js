import React from 'react'
import './Card.scss'
const Card = () => {
  return (
    <div class="bl_media">
    <figure class="bl_media_imgWrapper">
      <img alt="사진: 손에 든 스마트폰" src="assets/img/elements/persona.jpg" />
    </figure>
    <div class="bl_media_body">
      <h3 class="bl_media_ttl">
        사용자를 고려한 설계로 만족스러운 체험을
      </h3>
      <p class="bl_media_txt">
        웹사이트 설계는 제공하는 서비스나 퍼소나에 따라 달라집니다. 서비스와 퍼소나에 맞춘 설계를 통해 방문자에게 스트레스를 주지 않는 보다 나은 체험을 만들어 만족감을 높입니다.<br/>
        우리는 고객의 사이트에 맞는 사용성을 고려하기 때문에 세심한 분석과 의견 청취를 실시함으로써, 만족을 체험할 수 있는 크리에이티브 및 테크놀로지를 설계하고 구현함으로써 지금까지는 없던 기대를 뛰어넘는 사용자 체험을 제공합니다.
      </p>
    </div>
  </div>
  )
}

export default Card

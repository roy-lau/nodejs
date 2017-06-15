// 触发fullpage插件

    $('#fullpage').fullpage({
        verticalCentered: true, // 页面内容是否上下居中
        css3: true, // 优先使用css3动画，不支持CSS3的浏览器会自动降级用jq动画
        sectionsColor: ['#050D19', '#F7F8FA', '#254587', '#695684'], // 每页的颜色
        navigation: true, // 是否显示项目导航
        navigationPosition: 'left', // 小圆点显示位置
        navigationTooltips: ['HOME', 'service', 'banner', 'footer'] // 每个小圆点旁的提示名
    })
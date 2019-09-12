var file = null

$('#input').change(function () {
    if (this.files && this.files[0]) {
        $('#input_label').text(this.files[0].name)
        var reader = new FileReader()
        reader.readAsDataURL(this.files[0])
        reader.onload = function (e) {
            $('#cover').attr('src', reader.result)
            $('#class_score').text('')
            $('#class_name').text('')
        }
        file = this.files[0]
    }
});

function convert_chinese_name(eng_name) {
    if (eng_name == 'akita')
        return '秋田犬'
    else
        return '柴犬'
}

$('#submit').click(function (e) {
    if (file) {
        // disable button
        $(this).prop('disabled', true);
        // add spinner to button
        $(this).html(
            '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> 預測中...'
        );

        const formData = new FormData()
        formData.append('uploadFile', file)
        axios.post(
            'https://my-nodejs-web-245517.appspot.com/api/automl',
            formData
        ).then(response => {
            // show result
            $('#class_score').text((response.data.class_score * 100).toFixed(2) + '%')
            $('#class_name').text('的機率是「' + convert_chinese_name(response.data.class_name) + '」')

            // disable button
            $(this).prop('disabled', false);
            // reset the button
            $(this).html(
                '偵測'
            );
        })
    }
    else {
        console.log('請選擇圖片')
    }
});
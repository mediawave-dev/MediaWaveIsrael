$machinePath = [Environment]::GetEnvironmentVariable("Path", "Machine")
$userPath = [Environment]::GetEnvironmentVariable("Path", "User")
$env:Path = "$machinePath;$userPath"

$headers = @{
    Authorization = 'Bearer directus-admin-token'
    'Content-Type' = 'application/json'
}
$base = 'http://localhost:8055'

# Set admin user language
Invoke-RestMethod -Uri "$base/users/me" -Method PATCH -Headers $headers -Body '{"language":"he-IL"}' | Out-Null
Write-Host "Admin user language set to he-IL"

# Collection translations
$collections = @(
    @{ name = 'blog_posts';    he = 'פוסטים בבלוג' }
    @{ name = 'faqs';          he = 'שאלות נפוצות' }
    @{ name = 'how_we_work';   he = 'איך אנחנו עובדים' }
    @{ name = 'packages';      he = 'חבילות' }
    @{ name = 'projects';      he = 'פרויקטים' }
    @{ name = 'services';      he = 'שירותים' }
    @{ name = 'site_settings'; he = 'הגדרות האתר' }
    @{ name = 'testimonials';  he = 'המלצות' }
    @{ name = 'why_us';        he = 'למה אנחנו' }
)

foreach ($col in $collections) {
    $body = @{
        meta = @{
            translations = @(
                @{
                    language    = 'he-IL'
                    translation = $col.he
                    singular    = $col.he
                    plural      = $col.he
                }
            )
        }
    } | ConvertTo-Json -Depth 5

    try {
        Invoke-RestMethod -Uri "$base/collections/$($col.name)" -Method PATCH -Headers $headers -Body $body | Out-Null
        Write-Host "  [OK] $($col.name) -> $($col.he)"
    } catch {
        Write-Host "  [FAIL] $($col.name): $_"
    }
}

# Also set field translations for key fields
$fieldTranslations = @(
    @{ col = 'services'; field = 'title'; he = 'כותרת' }
    @{ col = 'services'; field = 'description'; he = 'תיאור' }
    @{ col = 'services'; field = 'tags'; he = 'תגיות' }
    @{ col = 'services'; field = 'sort'; he = 'סדר' }
    @{ col = 'services'; field = 'lottie_animation'; he = 'אנימציית Lottie' }
    @{ col = 'services'; field = 'lottie_size'; he = 'גודל אנימציה' }
    @{ col = 'packages'; field = 'name'; he = 'שם' }
    @{ col = 'packages'; field = 'price'; he = 'מחיר' }
    @{ col = 'packages'; field = 'description'; he = 'תיאור' }
    @{ col = 'packages'; field = 'features'; he = 'תכונות' }
    @{ col = 'packages'; field = 'ideal_for'; he = 'מתאים ל' }
    @{ col = 'packages'; field = 'cta'; he = 'כפתור פעולה' }
    @{ col = 'packages'; field = 'cta_link'; he = 'קישור כפתור' }
    @{ col = 'packages'; field = 'popular'; he = 'פופולרי' }
    @{ col = 'packages'; field = 'sort'; he = 'סדר' }
    @{ col = 'why_us'; field = 'title'; he = 'כותרת' }
    @{ col = 'why_us'; field = 'description'; he = 'תיאור' }
    @{ col = 'why_us'; field = 'color'; he = 'צבע' }
    @{ col = 'why_us'; field = 'lottie_animation'; he = 'אנימציית Lottie' }
    @{ col = 'why_us'; field = 'sort'; he = 'סדר' }
    @{ col = 'how_we_work'; field = 'step_number'; he = 'מספר שלב' }
    @{ col = 'how_we_work'; field = 'title'; he = 'כותרת' }
    @{ col = 'how_we_work'; field = 'description'; he = 'תיאור' }
    @{ col = 'how_we_work'; field = 'animation_path'; he = 'נתיב אנימציה' }
    @{ col = 'how_we_work'; field = 'sort'; he = 'סדר' }
    @{ col = 'faqs'; field = 'question'; he = 'שאלה' }
    @{ col = 'faqs'; field = 'answer'; he = 'תשובה' }
    @{ col = 'faqs'; field = 'sort'; he = 'סדר' }
    @{ col = 'blog_posts'; field = 'title'; he = 'כותרת' }
    @{ col = 'blog_posts'; field = 'slug'; he = 'סלאג' }
    @{ col = 'blog_posts'; field = 'excerpt'; he = 'תקציר' }
    @{ col = 'blog_posts'; field = 'content'; he = 'תוכן' }
    @{ col = 'blog_posts'; field = 'featured_image'; he = 'תמונה ראשית' }
    @{ col = 'blog_posts'; field = 'author'; he = 'כותב' }
    @{ col = 'blog_posts'; field = 'tags'; he = 'תגיות' }
    @{ col = 'blog_posts'; field = 'published_at'; he = 'תאריך פרסום' }
    @{ col = 'blog_posts'; field = 'status'; he = 'סטטוס' }
    @{ col = 'projects'; field = 'title'; he = 'כותרת' }
    @{ col = 'projects'; field = 'type'; he = 'סוג' }
    @{ col = 'projects'; field = 'description'; he = 'תיאור' }
    @{ col = 'projects'; field = 'url'; he = 'קישור' }
    @{ col = 'projects'; field = 'image'; he = 'תמונה' }
    @{ col = 'projects'; field = 'image_mobile'; he = 'תמונה מובייל' }
    @{ col = 'projects'; field = 'tags'; he = 'תגיות' }
    @{ col = 'projects'; field = 'features'; he = 'תכונות' }
    @{ col = 'projects'; field = 'featured'; he = 'מודגש' }
    @{ col = 'projects'; field = 'self_link'; he = 'קישור עצמי' }
    @{ col = 'projects'; field = 'sort'; he = 'סדר' }
    @{ col = 'testimonials'; field = 'name'; he = 'שם' }
    @{ col = 'testimonials'; field = 'business'; he = 'עסק' }
    @{ col = 'testimonials'; field = 'quote'; he = 'ציטוט' }
    @{ col = 'testimonials'; field = 'image'; he = 'תמונה' }
    @{ col = 'testimonials'; field = 'rating'; he = 'דירוג' }
    @{ col = 'testimonials'; field = 'url'; he = 'קישור' }
    @{ col = 'testimonials'; field = 'sort'; he = 'סדר' }
    @{ col = 'site_settings'; field = 'site_name'; he = 'שם האתר' }
    @{ col = 'site_settings'; field = 'site_description'; he = 'תיאור האתר' }
    @{ col = 'site_settings'; field = 'phone'; he = 'טלפון' }
    @{ col = 'site_settings'; field = 'email'; he = 'אימייל' }
    @{ col = 'site_settings'; field = 'whatsapp_number'; he = 'מספר וואטסאפ' }
    @{ col = 'site_settings'; field = 'instagram_url'; he = 'קישור אינסטגרם' }
    @{ col = 'site_settings'; field = 'facebook_url'; he = 'קישור פייסבוק' }
    @{ col = 'site_settings'; field = 'address'; he = 'כתובת' }
    @{ col = 'site_settings'; field = 'response_time'; he = 'זמן תגובה' }
    @{ col = 'site_settings'; field = 'logo'; he = 'לוגו' }
)

Write-Host ""
Write-Host "Setting field translations..."
foreach ($ft in $fieldTranslations) {
    $body = @{
        meta = @{
            translations = @(
                @{
                    language    = 'he-IL'
                    translation = $ft.he
                }
            )
        }
    } | ConvertTo-Json -Depth 5

    try {
        Invoke-RestMethod -Uri "$base/fields/$($ft.col)/$($ft.field)" -Method PATCH -Headers $headers -Body $body | Out-Null
        Write-Host "  [OK] $($ft.col).$($ft.field) -> $($ft.he)"
    } catch {
        Write-Host "  [SKIP] $($ft.col).$($ft.field)"
    }
}

Write-Host ""
Write-Host "Done! Refresh Directus at http://localhost:8055"

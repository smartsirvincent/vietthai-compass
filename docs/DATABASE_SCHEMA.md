# 越泰指南資料庫欄位設計

第一版建議資料表：

## site_settings

- id
- site_name
- site_name_en
- logo_url
- favicon_url
- line_url
- facebook_url
- instagram_url
- threads_url
- email
- phone
- default_meta_title
- default_meta_description

## cities

- id
- country
- name
- name_en
- slug
- summary
- best_season
- recommended_days
- audience
- business_angle
- cover_image_url
- seo_title
- meta_description
- status

## articles

- id
- title
- slug
- excerpt
- content
- category
- country
- city_id
- author_id
- status
- target_keyword
- search_intent
- seo_title
- meta_description
- canonical_url
- og_image_url
- source_links
- review_notes
- published_at
- last_updated_at

## restaurants

- id
- name
- name_en
- local_name
- slug
- country
- city_id
- district
- category
- description
- price_level
- recommended_dishes
- address
- google_map_url
- latitude
- longitude
- opening_hours
- phone
- email
- website_url
- line_url
- facebook_url
- instagram_url
- threads_url
- is_business_friendly
- has_chinese_service
- is_taiwanese_owned
- seo_title
- meta_description
- status

## attractions

- id
- name
- name_en
- local_name
- slug
- country
- city_id
- category
- description
- address
- google_map_url
- opening_hours
- ticket_price
- recommended_duration
- transportation
- suitable_for
- seo_title
- meta_description
- status

## businesses

- id
- business_name
- slug
- country
- city_id
- category
- description
- services
- target_audience
- address
- google_map_url
- phone
- email
- website_url
- line_url
- facebook_url
- instagram_url
- threads_url
- logo_url
- cover_image_url
- is_taiwanese_owned
- has_chinese_service
- is_verified
- plan_type
- sort_priority
- seo_title
- meta_description
- status

## research_briefs

- id
- title
- target_keyword
- audience
- search_intent
- content_type
- country
- city_id
- sources_to_collect
- output_sections
- seo_checks
- status
- assigned_to
- created_at
- updated_at

## content_sources

- id
- research_brief_id
- title
- url
- source_type
- reliability_note
- collected_at

## content_drafts

- id
- research_brief_id
- article_id
- draft_title
- draft_body
- seo_title
- meta_description
- faq_json
- internal_links_json
- source_links_json
- review_status
- created_at
- updated_at

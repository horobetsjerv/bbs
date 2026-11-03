CREATE TYPE "public"."lead_form_type" AS ENUM('feedback', 'sample_order', 'price_request');--> statement-breakpoint
CREATE TYPE "public"."lead_status" AS ENUM('new', 'in_progress', 'closed');--> statement-breakpoint
CREATE TYPE "public"."post_status" AS ENUM('draft', 'published');--> statement-breakpoint
CREATE TYPE "public"."admin_role" AS ENUM('owner', 'editor');--> statement-breakpoint
CREATE TABLE "applications" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "applications_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"slug" varchar(64) NOT NULL,
	"name" varchar(64) NOT NULL,
	"icon" varchar(64),
	"sort" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "applications_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "brands" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "brands_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"slug" varchar(64) NOT NULL,
	"name" varchar(128) NOT NULL,
	"description" text,
	"hero_image" text,
	"video_url" text,
	"sort" integer DEFAULT 0 NOT NULL,
	"seo_title" varchar(255),
	"seo_description" text,
	"og_image" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "brands_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "collections" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "collections_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"brand_id" integer NOT NULL,
	"slug" varchar(128) NOT NULL,
	"name" varchar(128) NOT NULL,
	"description" text,
	"image" text,
	"sort" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "colors" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "colors_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"slug" varchar(64) NOT NULL,
	"name" varchar(64) NOT NULL,
	"hex" varchar(7),
	"sort" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "colors_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "designs" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "designs_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"slug" varchar(64) NOT NULL,
	"name" varchar(64) NOT NULL,
	"sort" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "designs_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "material_applications" (
	"material_id" integer NOT NULL,
	"application_id" integer NOT NULL,
	CONSTRAINT "material_applications_material_id_application_id_pk" PRIMARY KEY("material_id","application_id")
);
--> statement-breakpoint
CREATE TABLE "material_colors" (
	"material_id" integer NOT NULL,
	"color_id" integer NOT NULL,
	CONSTRAINT "material_colors_material_id_color_id_pk" PRIMARY KEY("material_id","color_id")
);
--> statement-breakpoint
CREATE TABLE "material_designs" (
	"material_id" integer NOT NULL,
	"design_id" integer NOT NULL,
	CONSTRAINT "material_designs_material_id_design_id_pk" PRIMARY KEY("material_id","design_id")
);
--> statement-breakpoint
CREATE TABLE "material_images" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "material_images_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"material_id" integer NOT NULL,
	"url" text NOT NULL,
	"alt" varchar(255),
	"is_main" boolean DEFAULT false NOT NULL,
	"sort" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "material_related" (
	"material_id" integer NOT NULL,
	"related_id" integer NOT NULL,
	"sort" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "material_related_material_id_related_id_pk" PRIMARY KEY("material_id","related_id")
);
--> statement-breakpoint
CREATE TABLE "material_sizes" (
	"material_id" integer NOT NULL,
	"size_id" integer NOT NULL,
	CONSTRAINT "material_sizes_material_id_size_id_pk" PRIMARY KEY("material_id","size_id")
);
--> statement-breakpoint
CREATE TABLE "material_surfaces" (
	"material_id" integer NOT NULL,
	"surface_id" integer NOT NULL,
	CONSTRAINT "material_surfaces_material_id_surface_id_pk" PRIMARY KEY("material_id","surface_id")
);
--> statement-breakpoint
CREATE TABLE "material_thicknesses" (
	"material_id" integer NOT NULL,
	"thickness_id" integer NOT NULL,
	CONSTRAINT "material_thicknesses_material_id_thickness_id_pk" PRIMARY KEY("material_id","thickness_id")
);
--> statement-breakpoint
CREATE TABLE "materials" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "materials_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"brand_id" integer NOT NULL,
	"collection_id" integer,
	"slug" varchar(160) NOT NULL,
	"name" varchar(160) NOT NULL,
	"article" varchar(64) NOT NULL,
	"description" text,
	"tech_specs" jsonb,
	"spec_pdf_url" text,
	"source_url" text,
	"in_stock" boolean DEFAULT false NOT NULL,
	"is_published" boolean DEFAULT true NOT NULL,
	"sort" integer DEFAULT 0 NOT NULL,
	"seo_title" varchar(255),
	"seo_description" text,
	"og_image" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sizes" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "sizes_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"brand_id" integer NOT NULL,
	"slug" varchar(64) NOT NULL,
	"label" varchar(64) NOT NULL,
	"width_mm" integer NOT NULL,
	"height_mm" integer NOT NULL,
	"sort" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "surfaces" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "surfaces_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"slug" varchar(64) NOT NULL,
	"name" varchar(64) NOT NULL,
	"sort" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "surfaces_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "thicknesses" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "thicknesses_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"brand_id" integer NOT NULL,
	"value_mm" integer NOT NULL,
	"sort" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "thicknesses_brand_value_uq" UNIQUE("brand_id","value_mm")
);
--> statement-breakpoint
CREATE TABLE "project_images" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "project_images_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"project_id" integer NOT NULL,
	"url" text NOT NULL,
	"alt" varchar(255),
	"sort" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_materials" (
	"project_id" integer NOT NULL,
	"material_id" integer NOT NULL,
	CONSTRAINT "project_materials_project_id_material_id_pk" PRIMARY KEY("project_id","material_id")
);
--> statement-breakpoint
CREATE TABLE "project_tag_links" (
	"project_id" integer NOT NULL,
	"tag_id" integer NOT NULL,
	CONSTRAINT "project_tag_links_project_id_tag_id_pk" PRIMARY KEY("project_id","tag_id")
);
--> statement-breakpoint
CREATE TABLE "project_tags" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "project_tags_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"slug" varchar(64) NOT NULL,
	"name" varchar(64) NOT NULL,
	"sort" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "project_tags_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "projects_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"slug" varchar(160) NOT NULL,
	"name" varchar(200) NOT NULL,
	"cover_image" text NOT NULL,
	"short_description" varchar(300),
	"body" text,
	"year" integer,
	"is_published" boolean DEFAULT true NOT NULL,
	"sort" integer DEFAULT 0 NOT NULL,
	"seo_title" varchar(255),
	"seo_description" text,
	"og_image" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "projects_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "lead_topics" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "lead_topics_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"slug" varchar(64) NOT NULL,
	"name" varchar(128) NOT NULL,
	"sort" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "lead_topics_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "leads" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "leads_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"form_type" "lead_form_type" DEFAULT 'feedback' NOT NULL,
	"name" varchar(160) NOT NULL,
	"phone" varchar(32) NOT NULL,
	"topic_id" integer,
	"message" text,
	"material_id" integer,
	"page_url" text,
	"utm_source" varchar(128),
	"utm_medium" varchar(128),
	"utm_campaign" varchar(128),
	"utm_term" varchar(128),
	"utm_content" varchar(128),
	"ip" varchar(64),
	"user_agent" text,
	"status" "lead_status" DEFAULT 'new' NOT NULL,
	"telegram_sent_at" timestamp with time zone,
	"telegram_error" text,
	"sheets_synced_at" timestamp with time zone,
	"sheets_error" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "media" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "media_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"url" text NOT NULL,
	"filename" varchar(255) NOT NULL,
	"mime" varchar(128) NOT NULL,
	"size_bytes" integer,
	"width" integer,
	"height" integer,
	"alt" varchar(255),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pages" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "pages_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"slug" varchar(128) NOT NULL,
	"title" varchar(255) NOT NULL,
	"blocks" jsonb,
	"seo_title" varchar(255),
	"seo_description" text,
	"og_image" text,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "pages_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "posts" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "posts_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"slug" varchar(160) NOT NULL,
	"title" varchar(255) NOT NULL,
	"excerpt" text,
	"body" text,
	"cover_image" text,
	"author" varchar(128),
	"status" "post_status" DEFAULT 'draft' NOT NULL,
	"published_at" timestamp with time zone,
	"seo_title" varchar(255),
	"seo_description" text,
	"og_image" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "posts_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "redirects" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "redirects_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"from_path" varchar(512) NOT NULL,
	"to_path" varchar(512) NOT NULL,
	"status_code" smallint DEFAULT 301 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "redirects_from_path_unique" UNIQUE("from_path")
);
--> statement-breakpoint
CREATE TABLE "settings" (
	"id" smallint PRIMARY KEY DEFAULT 1 NOT NULL,
	"phones" jsonb,
	"emails" jsonb,
	"address" text,
	"map_lat" varchar(32),
	"map_lng" varchar(32),
	"working_hours" text,
	"socials" jsonb,
	"telegram_chat_id" varchar(64),
	"google_sheet_id" varchar(128),
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "admin_sessions" (
	"token_hash" varchar(64) PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"ip" varchar(64),
	"user_agent" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "admin_users" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "admin_users_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"email" varchar(255) NOT NULL,
	"name" varchar(128),
	"password_hash" text NOT NULL,
	"role" "admin_role" DEFAULT 'editor' NOT NULL,
	"totp_secret" text,
	"totp_enabled_at" timestamp with time zone,
	"last_login_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "admin_users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "collections" ADD CONSTRAINT "collections_brand_id_brands_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."brands"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "material_applications" ADD CONSTRAINT "material_applications_material_id_materials_id_fk" FOREIGN KEY ("material_id") REFERENCES "public"."materials"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "material_applications" ADD CONSTRAINT "material_applications_application_id_applications_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."applications"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "material_colors" ADD CONSTRAINT "material_colors_material_id_materials_id_fk" FOREIGN KEY ("material_id") REFERENCES "public"."materials"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "material_colors" ADD CONSTRAINT "material_colors_color_id_colors_id_fk" FOREIGN KEY ("color_id") REFERENCES "public"."colors"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "material_designs" ADD CONSTRAINT "material_designs_material_id_materials_id_fk" FOREIGN KEY ("material_id") REFERENCES "public"."materials"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "material_designs" ADD CONSTRAINT "material_designs_design_id_designs_id_fk" FOREIGN KEY ("design_id") REFERENCES "public"."designs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "material_images" ADD CONSTRAINT "material_images_material_id_materials_id_fk" FOREIGN KEY ("material_id") REFERENCES "public"."materials"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "material_related" ADD CONSTRAINT "material_related_material_id_materials_id_fk" FOREIGN KEY ("material_id") REFERENCES "public"."materials"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "material_related" ADD CONSTRAINT "material_related_related_id_materials_id_fk" FOREIGN KEY ("related_id") REFERENCES "public"."materials"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "material_sizes" ADD CONSTRAINT "material_sizes_material_id_materials_id_fk" FOREIGN KEY ("material_id") REFERENCES "public"."materials"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "material_sizes" ADD CONSTRAINT "material_sizes_size_id_sizes_id_fk" FOREIGN KEY ("size_id") REFERENCES "public"."sizes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "material_surfaces" ADD CONSTRAINT "material_surfaces_material_id_materials_id_fk" FOREIGN KEY ("material_id") REFERENCES "public"."materials"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "material_surfaces" ADD CONSTRAINT "material_surfaces_surface_id_surfaces_id_fk" FOREIGN KEY ("surface_id") REFERENCES "public"."surfaces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "material_thicknesses" ADD CONSTRAINT "material_thicknesses_material_id_materials_id_fk" FOREIGN KEY ("material_id") REFERENCES "public"."materials"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "material_thicknesses" ADD CONSTRAINT "material_thicknesses_thickness_id_thicknesses_id_fk" FOREIGN KEY ("thickness_id") REFERENCES "public"."thicknesses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "materials" ADD CONSTRAINT "materials_brand_id_brands_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."brands"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "materials" ADD CONSTRAINT "materials_collection_id_collections_id_fk" FOREIGN KEY ("collection_id") REFERENCES "public"."collections"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sizes" ADD CONSTRAINT "sizes_brand_id_brands_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."brands"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "thicknesses" ADD CONSTRAINT "thicknesses_brand_id_brands_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."brands"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_images" ADD CONSTRAINT "project_images_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_materials" ADD CONSTRAINT "project_materials_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_materials" ADD CONSTRAINT "project_materials_material_id_materials_id_fk" FOREIGN KEY ("material_id") REFERENCES "public"."materials"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_tag_links" ADD CONSTRAINT "project_tag_links_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_tag_links" ADD CONSTRAINT "project_tag_links_tag_id_project_tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."project_tags"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leads" ADD CONSTRAINT "leads_topic_id_lead_topics_id_fk" FOREIGN KEY ("topic_id") REFERENCES "public"."lead_topics"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leads" ADD CONSTRAINT "leads_material_id_materials_id_fk" FOREIGN KEY ("material_id") REFERENCES "public"."materials"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "admin_sessions" ADD CONSTRAINT "admin_sessions_user_id_admin_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."admin_users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "collections_brand_slug_uq" ON "collections" USING btree ("brand_id","slug");--> statement-breakpoint
CREATE INDEX "material_applications_application_idx" ON "material_applications" USING btree ("application_id");--> statement-breakpoint
CREATE INDEX "material_colors_color_idx" ON "material_colors" USING btree ("color_id");--> statement-breakpoint
CREATE INDEX "material_designs_design_idx" ON "material_designs" USING btree ("design_id");--> statement-breakpoint
CREATE INDEX "material_images_material_idx" ON "material_images" USING btree ("material_id");--> statement-breakpoint
CREATE INDEX "material_sizes_size_idx" ON "material_sizes" USING btree ("size_id");--> statement-breakpoint
CREATE INDEX "material_surfaces_surface_idx" ON "material_surfaces" USING btree ("surface_id");--> statement-breakpoint
CREATE INDEX "material_thicknesses_thickness_idx" ON "material_thicknesses" USING btree ("thickness_id");--> statement-breakpoint
CREATE UNIQUE INDEX "materials_brand_slug_uq" ON "materials" USING btree ("brand_id","slug");--> statement-breakpoint
CREATE UNIQUE INDEX "materials_brand_article_uq" ON "materials" USING btree ("brand_id","article");--> statement-breakpoint
CREATE INDEX "materials_collection_idx" ON "materials" USING btree ("collection_id");--> statement-breakpoint
CREATE INDEX "materials_published_idx" ON "materials" USING btree ("is_published");--> statement-breakpoint
CREATE INDEX "materials_search_idx" ON "materials" USING gin (to_tsvector('simple', coalesce("name", '') || ' ' || coalesce("article", '') || ' ' || coalesce("description", '')));--> statement-breakpoint
CREATE UNIQUE INDEX "sizes_brand_slug_uq" ON "sizes" USING btree ("brand_id","slug");--> statement-breakpoint
CREATE INDEX "project_images_project_idx" ON "project_images" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX "project_materials_material_idx" ON "project_materials" USING btree ("material_id");--> statement-breakpoint
CREATE INDEX "project_tag_links_tag_idx" ON "project_tag_links" USING btree ("tag_id");--> statement-breakpoint
CREATE INDEX "projects_published_idx" ON "projects" USING btree ("is_published");--> statement-breakpoint
CREATE INDEX "projects_search_idx" ON "projects" USING gin (to_tsvector('simple', coalesce("name", '') || ' ' || coalesce("short_description", '')));--> statement-breakpoint
CREATE INDEX "leads_created_idx" ON "leads" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "leads_status_idx" ON "leads" USING btree ("status");--> statement-breakpoint
CREATE INDEX "leads_phone_idx" ON "leads" USING btree ("phone");--> statement-breakpoint
CREATE INDEX "media_created_idx" ON "media" USING btree ("created_at" desc);--> statement-breakpoint
CREATE INDEX "posts_status_published_idx" ON "posts" USING btree ("status","published_at");--> statement-breakpoint
CREATE INDEX "redirects_active_idx" ON "redirects" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "admin_sessions_user_idx" ON "admin_sessions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "admin_sessions_expires_idx" ON "admin_sessions" USING btree ("expires_at");
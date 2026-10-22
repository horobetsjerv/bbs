CREATE TABLE "material_variants" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "material_variants_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"material_id" integer NOT NULL,
	"size_id" integer NOT NULL,
	"thickness_id" integer NOT NULL,
	"sort" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "material_variants_uq" UNIQUE("material_id","size_id","thickness_id")
);
--> statement-breakpoint
ALTER TABLE "thicknesses" DROP CONSTRAINT "thicknesses_brand_value_uq";--> statement-breakpoint
ALTER TABLE "material_images" ADD COLUMN "surface_id" integer;--> statement-breakpoint
ALTER TABLE "material_surfaces" ADD COLUMN "source_url" text;--> statement-breakpoint
ALTER TABLE "thicknesses" ADD COLUMN "label" varchar(32);--> statement-breakpoint
UPDATE "thicknesses" SET "label" = "value_mm" || ' мм' WHERE "label" IS NULL;--> statement-breakpoint
ALTER TABLE "thicknesses" ALTER COLUMN "label" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "material_variants" ADD CONSTRAINT "material_variants_material_id_materials_id_fk" FOREIGN KEY ("material_id") REFERENCES "public"."materials"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "material_variants" ADD CONSTRAINT "material_variants_size_id_sizes_id_fk" FOREIGN KEY ("size_id") REFERENCES "public"."sizes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "material_variants" ADD CONSTRAINT "material_variants_thickness_id_thicknesses_id_fk" FOREIGN KEY ("thickness_id") REFERENCES "public"."thicknesses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "material_variants_size_idx" ON "material_variants" USING btree ("size_id");--> statement-breakpoint
CREATE INDEX "material_variants_thickness_idx" ON "material_variants" USING btree ("thickness_id");--> statement-breakpoint
ALTER TABLE "material_images" ADD CONSTRAINT "material_images_surface_id_surfaces_id_fk" FOREIGN KEY ("surface_id") REFERENCES "public"."surfaces"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "material_images_surface_idx" ON "material_images" USING btree ("surface_id");--> statement-breakpoint
ALTER TABLE "thicknesses" ADD CONSTRAINT "thicknesses_brand_label_uq" UNIQUE("brand_id","label");
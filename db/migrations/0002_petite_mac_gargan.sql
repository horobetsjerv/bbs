ALTER TABLE "material_variants" DROP CONSTRAINT "material_variants_uq";--> statement-breakpoint
ALTER TABLE "material_variants" ADD COLUMN "surface_id" integer;--> statement-breakpoint
ALTER TABLE "material_variants" ADD CONSTRAINT "material_variants_surface_id_surfaces_id_fk" FOREIGN KEY ("surface_id") REFERENCES "public"."surfaces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "material_variants" ADD CONSTRAINT "material_variants_uq" UNIQUE("material_id","surface_id","size_id","thickness_id");
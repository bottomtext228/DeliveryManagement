using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DeliveryManagement.Migrations
{
    /// <inheritdoc />
    public partial class ProductSizeInVector : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "SizeX",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "SizeY",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "SizeZ",
                table: "Products");

            migrationBuilder.AddColumn<string>(
                name: "Size",
                table: "Products",
                type: "TEXT",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Size",
                table: "Products");

            migrationBuilder.AddColumn<float>(
                name: "SizeX",
                table: "Products",
                type: "REAL",
                nullable: false,
                defaultValue: 0f);

            migrationBuilder.AddColumn<float>(
                name: "SizeY",
                table: "Products",
                type: "REAL",
                nullable: false,
                defaultValue: 0f);

            migrationBuilder.AddColumn<float>(
                name: "SizeZ",
                table: "Products",
                type: "REAL",
                nullable: false,
                defaultValue: 0f);
        }
    }
}

class ProductsController < ApplicationController
  before_action :get_product, except: [:index, :create]
  respond_to :html, :json

  def index
    @products = Product.all
    respond_with(@products) do |format|
      format.json { render :json => @products.as_json }
      format.html
    end
  end

  def create
   @product= Product.new(product_params)
    if @product.save
      render json: @product.as_json, status: :ok
    else
      render json: {product: @product.errors, status: :no_content}
    end
  end  

  def show
    respond_with(@product.as_json)
  end

  def update
    if @product.update_attributes(product_params)
      render json: @product.as_json, status: :ok 
    else
      render json: {product:@product.errors, status: :unprocessable_entity}
    end
  end

  def destroy
    @product.destroy
    render json: {status: :ok}
  end

  private

  def product_params
    params.require(:product).permit(:name, :price, :discount)
    # name: nil, price: nil, discount: nil,
  end

  def get_product
    @product = Product.find(params[:id])
    render json: {status: :not_found} unless @product
  end

end
